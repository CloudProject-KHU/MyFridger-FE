import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import AppleIcon from '@/assets/images/ingredients/apple.svg';
import AvocadoIcon from '@/assets/images/ingredients/avocado.svg';
import BananaIcon from '@/assets/images/ingredients/banana.svg';
import BeefIcon from '@/assets/images/ingredients/beef.svg';
import BroccoliIcon from '@/assets/images/ingredients/broccoli.svg';
import ButterIcon from '@/assets/images/ingredients/butter.svg';
import CabbageIcon from '@/assets/images/ingredients/cabbage.svg';
import CarrotIcon from '@/assets/images/ingredients/carrot.svg';
import CheeseIcon from '@/assets/images/ingredients/cheese.svg';
import ChickenIcon from '@/assets/images/ingredients/chicken.svg';
import ChiliIcon from '@/assets/images/ingredients/chili.svg';
import ClamIcon from '@/assets/images/ingredients/clam.svg';
import CornIcon from '@/assets/images/ingredients/corn.svg';
import CrabIcon from '@/assets/images/ingredients/crab.svg';
import DairyProcessedIcon from '@/assets/images/ingredients/dairy_processed.svg';
import DuckIcon from '@/assets/images/ingredients/duck.svg';
import DumplingIcon from '@/assets/images/ingredients/dumpling.svg';
import EggIcon from '@/assets/images/ingredients/egg.svg';
import EggplantIcon from '@/assets/images/ingredients/eggplant.svg';
import EtcIcon from '@/assets/images/ingredients/etc.svg';
import FishIcon from '@/assets/images/ingredients/fish.svg';
import FruitIcon from '@/assets/images/ingredients/fruit.svg';
import GarlicIcon from '@/assets/images/ingredients/garlic.svg';
import GrapeIcon from '@/assets/images/ingredients/grape.svg';
import HomemadeIcon from '@/assets/images/ingredients/homemade.svg';
import KetchupIcon from '@/assets/images/ingredients/ketchup.svg';
import KimchiIcon from '@/assets/images/ingredients/kimchi.svg';
import KiwiIcon from '@/assets/images/ingredients/kiwi.svg';
import LambIcon from '@/assets/images/ingredients/lamb.svg';
import LemonIcon from '@/assets/images/ingredients/lemon.svg';
import LettuceIcon from '@/assets/images/ingredients/lettuce.svg';
import LobsterIcon from '@/assets/images/ingredients/lobster.svg';
import MangoIcon from '@/assets/images/ingredients/mango.svg';
import MelonIcon from '@/assets/images/ingredients/melon.svg';
import MilkIcon from '@/assets/images/ingredients/milk.svg';
import MushroomIcon from '@/assets/images/ingredients/mushroom.svg';
import MustardIcon from '@/assets/images/ingredients/mustard.svg';
import OnionIcon from '@/assets/images/ingredients/onion.svg';
import OrangeIcon from '@/assets/images/ingredients/orange.svg';
import PeachIcon from '@/assets/images/ingredients/peach.svg';
import PearIcon from '@/assets/images/ingredients/pear.svg';
import PineappleIcon from '@/assets/images/ingredients/pineapple.svg';
import PorkIcon from '@/assets/images/ingredients/pork.svg';
import PotatoIcon from '@/assets/images/ingredients/potato.svg';
import PumpkinIcon from '@/assets/images/ingredients/pumpkin.svg';
import RadishIcon from '@/assets/images/ingredients/radish.svg';
import SaltIcon from '@/assets/images/ingredients/salt.svg';
import SausageIcon from '@/assets/images/ingredients/sausage.svg';
import SeasoningIcon from '@/assets/images/ingredients/seasoning.svg';
import SeaweedIcon from '@/assets/images/ingredients/seaweed.svg';
import SesameOilIcon from '@/assets/images/ingredients/sesame_oil.svg';
import ShrimpIcon from '@/assets/images/ingredients/shrimp.svg';
import SoySauceIcon from '@/assets/images/ingredients/soy_sauce.svg';
import SquidIcon from '@/assets/images/ingredients/squid.svg';
import StrawberryIcon from '@/assets/images/ingredients/strawberry.svg';
import SugarIcon from '@/assets/images/ingredients/sugar.svg';
import SweetPotatoIcon from '@/assets/images/ingredients/sweet_potato.svg';
import TofuIcon from '@/assets/images/ingredients/tofu.svg';
import TomatoIcon from '@/assets/images/ingredients/tomato.svg';
import VegetableIcon from '@/assets/images/ingredients/vegetable.svg';
import WatermelonIcon from '@/assets/images/ingredients/watermelon.svg';
import ZucchiniIcon from '@/assets/images/ingredients/zucchini.svg';

export type IngredientIconComponent = FC<SvgProps>;

export const INGREDIENT_ICON_COMPONENTS: Record<string, IngredientIconComponent> = {
  apple: AppleIcon,
  avocado: AvocadoIcon,
  banana: BananaIcon,
  beef: BeefIcon,
  broccoli: BroccoliIcon,
  butter: ButterIcon,
  cabbage: CabbageIcon,
  carrot: CarrotIcon,
  cheese: CheeseIcon,
  chicken: ChickenIcon,
  chili: ChiliIcon,
  clam: ClamIcon,
  corn: CornIcon,
  crab: CrabIcon,
  dairy_processed: DairyProcessedIcon,
  duck: DuckIcon,
  dumpling: DumplingIcon,
  egg: EggIcon,
  eggplant: EggplantIcon,
  etc: EtcIcon,
  fish: FishIcon,
  fruit: FruitIcon,
  garlic: GarlicIcon,
  grape: GrapeIcon,
  homemade: HomemadeIcon,
  ketchup: KetchupIcon,
  kimchi: KimchiIcon,
  kiwi: KiwiIcon,
  lamb: LambIcon,
  lemon: LemonIcon,
  lettuce: LettuceIcon,
  lobster: LobsterIcon,
  mango: MangoIcon,
  melon: MelonIcon,
  milk: MilkIcon,
  mushroom: MushroomIcon,
  mustard: MustardIcon,
  onion: OnionIcon,
  orange: OrangeIcon,
  peach: PeachIcon,
  pear: PearIcon,
  pineapple: PineappleIcon,
  pork: PorkIcon,
  potato: PotatoIcon,
  pumpkin: PumpkinIcon,
  radish: RadishIcon,
  salt: SaltIcon,
  sausage: SausageIcon,
  seasoning: SeasoningIcon,
  seaweed: SeaweedIcon,
  sesame_oil: SesameOilIcon,
  shrimp: ShrimpIcon,
  soy_sauce: SoySauceIcon,
  squid: SquidIcon,
  strawberry: StrawberryIcon,
  sugar: SugarIcon,
  sweet_potato: SweetPotatoIcon,
  tofu: TofuIcon,
  tomato: TomatoIcon,
  vegetable: VegetableIcon,
  watermelon: WatermelonIcon,
  zucchini: ZucchiniIcon,
};

