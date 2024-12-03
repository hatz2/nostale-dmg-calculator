"""
This script creates .webp images from sprites and puts together images that
are splitted into multiple parts 
"""

from PIL import Image, UnidentifiedImageError
import json
from collections import defaultdict
import cv2

SPRITES_FOLDER_PATH = "./imgs/monster_sprites/"
NSMN_DATA_PATH = "./data/NSmnData.NOS.json"
SAVE_PATH = "./imgs/full_monster_sprites/"

def get_monster_sprite_metadata() -> dict:
    """
    Returned objects have this format:
    {
        "Date": "15/04/2003",
        "ID": 9216,
        "content": [
            {
                "path": "9216_0.png",
                "x-Origin": 27,
                "y-Origin": 111
            }
        ],
        "isCompressed": true
    }
    """
    content = {}
    base_file_name = "NSmpData"
    filenames = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0A", "0B", "0C", "0D", "0E", "0F"]

    for filename_ending in filenames:
        file = open(f"{SPRITES_FOLDER_PATH}/{base_file_name}{filename_ending}.NOS.json")
        json_content = json.load(file)
        file_content = json_content["content"]
        
        for obj in file_content:
            content[obj["ID"]] = obj

    return content

def get_path(img_id: int, frame_id=0):
    return f"{SPRITES_FOLDER_PATH}{img_id}_{frame_id}.png"

def get_full_img_size(images: list[Image.Image], metadata: dict) -> tuple[int, int]:
    max_offset_x = max(data["content"][0]["x-Origin"] for data in metadata)
    max_offset_y = max(data["content"][0]["y-Origin"] for data in metadata)

    width = max(
        max_offset_x - metadata[i]["content"][0]["x-Origin"] + images[i].size[0] \
        for i in range(len(images))
    )

    height = max(
        max_offset_y - metadata[i]["content"][0]["y-Origin"] + images[i].size[1] \
        for i in range(len(images))
    )

    return width, height

def craft_full_img(size: tuple[int, int], images: list[Image.Image], metadata: dict) -> Image.Image:
    full_img = Image.new("RGBA", size)

    max_offset_x = max(data["content"][0]["x-Origin"] for data in metadata)
    max_offset_y = max(data["content"][0]["y-Origin"] for data in metadata)

    for i in range(len(images)):
        img = images[i]
        data = metadata[i]

        offset = (
            max_offset_x - data["content"][0]["x-Origin"],
            max_offset_y - data["content"][0]["y-Origin"],
        )

        full_img.paste(img, offset, img)

    return full_img

def get_sprites_data():
    """
    Returned objects have this structure:

    {
        "animation": 1,
        "base": 59,
        "direction": 0,
        "kit": 0,
        "monster": 0,
        "nspm": -1,
        "parts": {
            "0": [
            ],
            "1": [
            ],
            "2": [
            ],
            "3": [
            ],
            "4": [
            ],
            "5": [
            ],
            "6": [
            ]
        }
    }
    """
    data = json.load(open(NSMN_DATA_PATH))
    return data

def get_img_ids(sprite_data: dict) -> list[int]:
    image_ids = [sprite_data["base"]]

    for i in range(0, 6):
        if len(sprite["parts"][str(i)]) > 0:
            image_ids.append(sprite["parts"][str(i)][0]["id"])

    return image_ids

def get_imgs(img_ids: list[int]) -> list[Image.Image]:
    images = []

    for id in image_ids:
        try:
            images.append(Image.open(get_path(id)))
        except UnidentifiedImageError as e:
            images.append(Image.new("RGBA", (0, 0)))
            print(e)

    return images

def get_imgs_metadata(img_ids: list[int]) -> list[Image.Image]:
    img_metadatas = []

    for id in image_ids:
        img_metadatas.append(metadata[id])

    return img_metadatas

if __name__ == "__main__":
    metadata = get_monster_sprite_metadata()
    sprite_data = get_sprites_data()

    for sprite in sprite_data:
        skin_id = sprite["monster"]
        animation = sprite["animation"]
        direction = sprite["direction"]

        image_ids = get_img_ids(sprite)
        images = get_imgs(image_ids)
        img_metadatas = get_imgs_metadata(image_ids)

        full_img_size = get_full_img_size(images, img_metadatas)
        full_img = craft_full_img(full_img_size, images, img_metadatas)

        try:
            full_img.save(
                f"{SAVE_PATH}{skin_id}_{animation}_{direction}.webp",
                format="WEBP",
            )
        except MemoryError as e:
            print(e)