import PIL
import argparse

import PIL.Image

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("src", help="Source IMG file path", type=str)
    parser.add_argument("dst", help="Destination IMG path", type=str)
    parser.add_argument("x", help="Distance from top left corner in X axis", type=int)
    parser.add_argument("y", help="Distance from top left corner in Y axis", type=int)
    parser.add_argument("width", help="Width of the new image", type=int)
    parser.add_argument("height", help="Height of the new image", type=int)

    args = parser.parse_args()

    src_path = args.src
    dst_path = args.dst
    x = args.x
    y = args.y
    width = args.width 
    height = args.height

    src_img = PIL.Image.open(src_path)
    crop_coords = (x, y, x + width, y + height)
    dst_img = src_img.crop(crop_coords)
    dst_img.save(dst_path)
    dst_img.show()