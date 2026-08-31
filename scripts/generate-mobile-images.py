from pathlib import Path

from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BOSSES = PUBLIC / "bosses"


def contained_size(width, height, max_width, max_height):
    scale = min(1, max_width / width, max_height / height)
    return max(1, round(width * scale)), max(1, round(height * scale))


def save_mobile_webp(source, destination, max_width=320, max_height=260):
    with Image.open(source) as image:
        size = contained_size(image.width, image.height, max_width, max_height)
        frames = []
        durations = []

        for frame in ImageSequence.Iterator(image):
            converted = frame.convert("RGBA")
            if converted.size != size:
                converted = converted.resize(size, Image.Resampling.LANCZOS)
            frames.append(converted)
            durations.append(frame.info.get("duration", image.info.get("duration", 100)))

        options = {"format": "WEBP", "quality": 76, "method": 6}
        if len(frames) > 1:
            options.update(
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=image.info.get("loop", 0),
                minimize_size=True,
            )
        frames[0].save(destination, **options)


def main():
    for source in BOSSES.iterdir():
        if source.is_file() and "-mobile" not in source.stem:
            destination = source.with_name(f"{source.stem}-mobile.webp")
            save_mobile_webp(source, destination)

    hero = PUBLIC / "hero-battle.png"
    save_mobile_webp(hero, PUBLIC / "hero-battle-mobile.webp", 720, 720)
    save_mobile_webp(hero, PUBLIC / "hero-battle.webp", 1263, 817)


if __name__ == "__main__":
    main()
