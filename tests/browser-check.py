"""Optional live-data smoke test: pip install playwright && playwright install chromium.
Run against a running production server: python tests/browser-check.py --url http://localhost:3000
"""
from argparse import ArgumentParser
from pathlib import Path
from tempfile import mkdtemp
import json
import re
from playwright.sync_api import sync_playwright

parser = ArgumentParser(description="Check Pokédex discovery and detail pages with live PokéAPI data.")
parser.add_argument("--url", default="http://localhost:9002")
parser.add_argument("--output-dir", default=None)
parser.add_argument("--axe-script", default=None, help="Optional path to axe-core's axe.min.js")
args = parser.parse_args()
BASE = args.url.rstrip("/")
OUT = Path(args.output_dir or mkdtemp(prefix="pokedex-browser-"))
OUT.mkdir(parents=True, exist_ok=True)


def no_overflow(page):
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "Page overflows"


def choose(page, label, value):
    page.get_by_role("combobox", name=label, exact=True).click()
    page.get_by_role("option", name=value, exact=True).click()


def loaded(page, name="Bulbasaur", number=1):
    page.get_by_role("link", name=re.compile(rf"^#{number:04d}.*{re.escape(name)}", re.I)).wait_for(timeout=60000)
    page.wait_for_load_state("networkidle")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 1000}, color_scheme="light", reduced_motion="reduce")
    page = context.new_page()
    page.set_default_timeout(30000)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    requests = []
    page.on("request", lambda request: requests.append(request.url))
    try:
        response = page.goto(BASE)
        assert 'href="/pokemon/1"' in response.text(), "Initial cards missing from server HTML"
        loaded(page)
        assert not any("/pokemon-species?" in url for url in requests), "SSR catalog was fetched again in the browser"
        cards = lambda: page.get_by_role("link", name=re.compile(r"^#\d{4}"))
        assert cards().count() == 24
        initial_metadata = [url for url in requests if re.match(r"https://pokeapi.co/api/v2/pokemon/\d+/$", url)]
        assert len(initial_metadata) == 24, f"Unexpected metadata requests: {len(initial_metadata)}"
        no_overflow(page)
        page.screenshot(path=str(OUT / "home-desktop-light.png"), full_page=True)
        print("PASS live full catalog, 24 visible records, bounded discovery loading")

        search = page.get_by_role("searchbox", name="Find your Pokémon")
        search.fill("#0025")
        loaded(page, "Pikachu", 25)
        assert cards().count() == 1
        assert "%230025" in page.url
        page.reload()
        loaded(page, "Pikachu", 25)
        assert search.input_value() == "#0025"
        choose(page, "Type", "Water")
        page.get_by_role("heading", name="No discoveries just yet").wait_for()
        page.get_by_role("button", name="Clear filters", exact=True).first.click()
        loaded(page)
        choose(page, "Type", "Electric")
        loaded(page, "Pikachu", 25)
        choose(page, "Generation", "Generation 1")
        loaded(page, "Pikachu", 25)
        assert cards().count() == 9
        choose(page, "Sort by", "Name: Z–A")
        page.wait_for_load_state("networkidle")
        assert "Zapdos" in cards().first.inner_text()
        page.get_by_role("switch", name="Show shiny Pokémon").check()
        assert "shiny=1" in page.url
        print("PASS numeric search, URL reload, combined filters, empty recovery, sorting, shiny")

        page.get_by_role("button", name="Clear filters", exact=True).first.click()
        choose(page, "Sort by", "Number: lowest first")
        loaded(page)
        page.get_by_role("button", name="Next", exact=True).click()
        loaded(page, "Pikachu", 25)
        assert "page=2" in page.url
        card = page.get_by_role("link", name=re.compile(r"^#0034.*Nidoking", re.I))
        card.scroll_into_view_if_needed()
        before_y = page.evaluate("window.scrollY")
        return_url = page.url
        card.click()
        page.get_by_role("heading", name="nidoking", level=1, exact=True).wait_for(timeout=60000)
        page.get_by_role("heading", name="Type effectiveness", exact=True).wait_for()
        page.get_by_role("heading", name="Learnable moves", exact=True).wait_for()
        page.wait_for_load_state("networkidle")
        assert page.get_by_text("Type notes are unavailable right now.", exact=False).count() == 0
        assert page.get_by_text("Move details couldn’t be loaded right now.", exact=False).count() == 0
        page.get_by_role("tab", name=re.compile("Level up")).wait_for(timeout=60000)
        no_overflow(page)
        page.screenshot(path=str(OUT / "entry-desktop-light.png"), full_page=True)
        page.get_by_role("link", name="Back to Pokédex").click()
        loaded(page, "Pikachu", 25)
        assert page.url == return_url
        page.wait_for_timeout(300)
        assert abs(page.evaluate("window.scrollY") - before_y) < 100, "Scroll not restored"
        print("PASS pagination, live detail sections without AI, return URL and scroll restoration")

        page.set_viewport_size({"width": 360, "height": 800})
        page.goto(BASE)
        loaded(page)
        no_overflow(page)
        page.screenshot(path=str(OUT / "home-mobile-light.png"), full_page=True)
        page.get_by_role("button", name="Filters", exact=True).click()
        dialog = page.get_by_role("dialog")
        dialog.wait_for()
        choose(page, "Type", "Fire")
        page.get_by_role("button", name="Show results", exact=True).click()
        loaded(page, "Charmander", 4)
        no_overflow(page)
        page.get_by_role("link", name=re.compile(r"^#0004.*Charmander", re.I)).click()
        page.get_by_role("heading", name="charmander", level=1, exact=True).wait_for(timeout=60000)
        page.wait_for_load_state("networkidle")
        no_overflow(page)
        assert page.get_by_role("heading", name="charmander", level=1, exact=True).bounding_box()["y"] < page.locator("img").first.bounding_box()["y"]
        page.screenshot(path=str(OUT / "entry-mobile-light.png"), full_page=True)
        print("PASS mobile drawer, filtering, no overflow, identity before artwork")

        page.get_by_role("button", name="Choose color theme").click()
        page.get_by_role("menuitemradio", name="Dark", exact=True).click()
        assert page.locator("html").evaluate("el => el.classList.contains('dark')")
        page.reload()
        page.get_by_role("heading", name="charmander", level=1, exact=True).wait_for(timeout=60000)
        page.wait_for_load_state("networkidle")
        assert page.locator("html").evaluate("el => el.classList.contains('dark')")
        no_overflow(page)
        page.screenshot(path=str(OUT / "entry-mobile-dark.png"), full_page=True)
        page.goto(BASE)
        loaded(page)
        page.screenshot(path=str(OUT / "home-mobile-dark.png"), full_page=True)
        page.set_viewport_size({"width": 1440, "height": 1000})
        page.screenshot(path=str(OUT / "home-desktop-dark.png"), full_page=True)
        print("PASS theme persistence and light/dark responsive screenshots")

        page.goto(BASE)
        loaded(page)
        page.keyboard.press("Tab")
        assert page.evaluate("document.activeElement.textContent") == "Skip to content"
        page.keyboard.press("Enter")
        assert page.evaluate("document.activeElement.id === 'main-content'")
        assert page.evaluate("getComputedStyle(document.documentElement).scrollBehavior") == "auto"
        print("PASS keyboard skip link and reduced-motion behavior")

        if args.axe_script:
            page.add_script_tag(path=args.axe_script)
            report = page.evaluate("""async () => {
              const result = await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
              return result.violations.map(v=>({id:v.id, impact:v.impact, nodes:v.nodes.map(n=>({target:n.target, summary:n.failureSummary}))}));
            }""")
            (OUT / "accessibility.json").write_text(json.dumps(report, indent=2))
            print("AXE", json.dumps(report))
            assert len(report) == 0, "Accessibility violations, see accessibility.json"

        failed = {"once": False}
        def fail_first(route):
            if not failed["once"]:
                failed["once"] = True
                route.fulfill(status=503, content_type="application/json", body="{}", headers={"Access-Control-Allow-Origin": "*"})
            else:
                route.continue_()
        page.route("**/api/v2/pokemon/1/", fail_first)
        page.reload()
        page.get_by_role("heading", name="A little trouble in the field").wait_for()
        page.get_by_role("button", name="Try again", exact=True).click()
        loaded(page)
        print("PASS API failure and retry recovery")
        assert not errors, f"Browser errors: {errors}"
        print("PASS no browser runtime errors")
        print(f"Screenshots and reports: {OUT}")
    except Exception:
        page.screenshot(path=str(OUT / "failure.png"), full_page=True)
        (OUT / "failure.html").write_text(page.content())
        print("BROWSER ERRORS:", errors)
        raise
    finally:
        context.close()
        browser.close()
