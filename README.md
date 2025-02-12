# Nostale Damage Calculator

As the title says this is a damage calculator (PVE only) for the MMORPG Nostale. The formula used in this calculator can be found [here](https://forum.de.nostale.gameforge.com/forum/thread/617-schadensberechnung/). The damage output should be pretty close to the official server but the calculator still lacks a lot of functionality. This is (kind of) my first web project and the code is probably not the best so don't judge it.

## Disclaimer

This project is an independent work done for educational purposes and without any intention of infringing the copyrights of the original game. All images, names and other elements belong to their respective owners and are used for reference and learning purposes only.

If rights holders consider that any content infringes their rights, they can contact us to request its immediate removal.

## How to use

I think it's pretty intuitive but basically you only have to do set up a few things:

- In the right side you can click the monster image to open up a menu where you can search and select the monster you want to test your damage against.
- In the left panel you need to set up your character's stuff like the level, items and the base damage. There are some hidden menus that you can show by rightlicking some slots:
  - Both weapons will allow you to change the minimum and maximum damage aswell as the upgrade level.
  - The fairy will allow you to change the fairy level.
  - The SP will allow you to set your SP points aswell as perfection gems.
- Make sure to also select a skill, otherwise the calculator won't work.

>[!NOTE]
> The value that you have to put inside the `Base damage` field is the damage that is shown when you press `P` in game without anything equipped.
>

## Missing stuff

As I pointed out earlier, the calculator is not complete and it still need a lot more visual work to make it look more "nostalish". The missing things are:

- Weapon shells
- Weapon runes
- Fairy shells
- Passives (Calvin Coach, books, family, etc)
- Titles
- Buffs
- Skill combos
- Skill upgrades
- Some kind of profile system to save and load configs
- Visual improvements

## Contributions

Contributions of any kind are welcome.

## Atributions

Thanks to Pumba98 for his [OnexExplorer](https://github.com/Pumba98/OnexExplorer) fork that allows to easily extract information from the game files.