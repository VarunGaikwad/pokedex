import { unown_image_base_url } from "../data/common";

export default function NotFound() {
  const unownForms: string[] = [
      "unown-a",
      "unown-b",
      "unown-c",
      "unown-d",
      "unown-e",
      "unown-f",
      "unown-g",
      "unown-h",
      "unown-i",
      "unown-j",
      "unown-k",
      "unown-l",
      "unown-m",
      "unown-n",
      "unown-o",
      "unown-p",
      "unown-q",
      "unown-r",
      "unown-s",
      "unown-t",
      "unown-u",
      "unown-v",
      "unown-w",
      "unown-x",
      "unown-y",
      "unown-z",
      "unown-exclamation",
      "unown-question",
    ],
    getRandomUnown = (): string => {
      const randomIndex: number = Math.floor(Math.random() * unownForms.length);
      return unownForms[randomIndex];
    };
  return (
    <div className="flex flex-col h-screen items-center gap-6 justify-center px-2">
      <span className="text-5xl justify-center font-semibold text-center">
        Page not found!
      </span>
      <span className="text-xl text-center opacity-90">
        Sorry! The page you're looking for is not here.
      </span>
      <img
        className="w-20"
        src={`${unown_image_base_url}/vector/${getRandomUnown()}.png`}
        loading="lazy"
        alt="Unown"
      />
    </div>
  );
}
