import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import AnchovyIcon from '@/assets/images/ingredients/anchovi.svg';
import AppleIcon from '@/assets/images/ingredients/apple.svg';
import AsparagusIcon from '@/assets/images/ingredients/asparagus.svg';
import AvocadoIcon from '@/assets/images/ingredients/avocado.svg';
import BaconIcon from '@/assets/images/ingredients/bacon.svg';
import BananaIcon from '@/assets/images/ingredients/banana.svg';
import BasilIcon from '@/assets/images/ingredients/basil.svg';
import BeanSproutIcon from '@/assets/images/ingredients/bean_sprout.svg';
import BeefIcon from '@/assets/images/ingredients/beef.svg';
import BellPepperIcon from '@/assets/images/ingredients/bell_pepper.svg';
import BlueberryIcon from '@/assets/images/ingredients/blueberry.svg';
import BokchoyIcon from '@/assets/images/ingredients/bokchoy.svg';
import BroccoliIcon from '@/assets/images/ingredients/broccoli.svg';
import ButterIcon from '@/assets/images/ingredients/butter.svg';
import CabbageIcon from '@/assets/images/ingredients/cabbage.svg';
import CannedIcon from '@/assets/images/ingredients/canned.svg';
import CarrotIcon from '@/assets/images/ingredients/carrot.svg';
import CeleryIcon from '@/assets/images/ingredients/celery.svg';
import CheeseIcon from '@/assets/images/ingredients/cheese.svg';
import ChickenIcon from '@/assets/images/ingredients/chicken.svg';
import ChiliIcon from '@/assets/images/ingredients/chili.svg';
import ClamIcon from '@/assets/images/ingredients/clam.svg';
import CoconutIcon from '@/assets/images/ingredients/coconut.svg';
import CornIcon from '@/assets/images/ingredients/corn.svg';
import CrabIcon from '@/assets/images/ingredients/crab.svg';
import CranberryIcon from '@/assets/images/ingredients/cranberry.svg';
import CreamIcon from '@/assets/images/ingredients/cream.svg';
import CucumberIcon from '@/assets/images/ingredients/cucumber.svg';
import DairyProcessedIcon from '@/assets/images/ingredients/dairy_processed.svg';
import DragonFruitIcon from '@/assets/images/ingredients/dragon_fruit.svg';
import DuckIcon from '@/assets/images/ingredients/duck.svg';
import DumplingIcon from '@/assets/images/ingredients/dumpling.svg';
import EggIcon from '@/assets/images/ingredients/egg.svg';
import EggplantIcon from '@/assets/images/ingredients/eggplant.svg';
import EtcIcon from '@/assets/images/ingredients/etc.svg';
import FishIcon from '@/assets/images/ingredients/fish.svg';
import FruitIcon from '@/assets/images/ingredients/fruit.svg';
import GarlicIcon from '@/assets/images/ingredients/garlic.svg';
import GrapeIcon from '@/assets/images/ingredients/grape.svg';
import GrapefruitIcon from '@/assets/images/ingredients/grapefruit.svg';
import HomemadeIcon from '@/assets/images/ingredients/homemade.svg';
import KetchupIcon from '@/assets/images/ingredients/ketchup.svg';
import KimchiIcon from '@/assets/images/ingredients/kimchi.svg';
import KiwiIcon from '@/assets/images/ingredients/kiwi.svg';
import LambIcon from '@/assets/images/ingredients/lamb.svg';
import LemonIcon from '@/assets/images/ingredients/lemon.svg';
import LettuceIcon from '@/assets/images/ingredients/lettuce.svg';
import LimeIcon from '@/assets/images/ingredients/lime.svg';
import LobsterIcon from '@/assets/images/ingredients/lobster.svg';
import MandarinIcon from '@/assets/images/ingredients/mandarin.svg';
import MangoIcon from '@/assets/images/ingredients/mango.svg';
import MelonIcon from '@/assets/images/ingredients/melon.svg';
import MilkIcon from '@/assets/images/ingredients/milk.svg';
import MushroomIcon from '@/assets/images/ingredients/mushroom.svg';
import MustardIcon from '@/assets/images/ingredients/mustard.svg';
import OliveIcon from '@/assets/images/ingredients/olive.svg';
import OnionIcon from '@/assets/images/ingredients/onion.svg';
import OrangeIcon from '@/assets/images/ingredients/orange.svg';
import ParsleyIcon from '@/assets/images/ingredients/parsley.svg';
import PeachIcon from '@/assets/images/ingredients/peach.svg';
import PearIcon from '@/assets/images/ingredients/pear.svg';
import PeasIcon from '@/assets/images/ingredients/peas.svg';
import PerillaLeafIcon from '@/assets/images/ingredients/perilla_leaf.svg';
import PersimmonIcon from '@/assets/images/ingredients/persimmon.svg';
import PineappleIcon from '@/assets/images/ingredients/pineapple.svg';
import PlumIcon from '@/assets/images/ingredients/plum.svg';
import PomegranateIcon from '@/assets/images/ingredients/pomegranate.svg';
import PorkIcon from '@/assets/images/ingredients/pork.svg';
import PotatoIcon from '@/assets/images/ingredients/potato.svg';
import PumpkinIcon from '@/assets/images/ingredients/pumpkin.svg';
import RadishIcon from '@/assets/images/ingredients/radish.svg';
import RaspberryIcon from '@/assets/images/ingredients/raspberry.svg';
import SalamiIcon from '@/assets/images/ingredients/salami.svg';
import SaltIcon from '@/assets/images/ingredients/salt.svg';
import SausageIcon from '@/assets/images/ingredients/sausage.svg';
import ScallionIcon from '@/assets/images/ingredients/scallion.svg';
import SeasoningIcon from '@/assets/images/ingredients/seasoning.svg';
import SeaweedIcon from '@/assets/images/ingredients/seaweed.svg';
import SesameOilIcon from '@/assets/images/ingredients/sesame_oil.svg';
import ShrimpIcon from '@/assets/images/ingredients/shrimp.svg';
import SoySauceIcon from '@/assets/images/ingredients/soy_sauce.svg';
import SpinachIcon from '@/assets/images/ingredients/spinach.svg';
import SquidIcon from '@/assets/images/ingredients/squid.svg';
import StrawberryIcon from '@/assets/images/ingredients/strawberry.svg';
import SugarIcon from '@/assets/images/ingredients/sugar.svg';
import SweetPotatoIcon from '@/assets/images/ingredients/sweet_potato.svg';
import TofuIcon from '@/assets/images/ingredients/tofu.svg';
import TomatoIcon from '@/assets/images/ingredients/tomato.svg';
import VegetableIcon from '@/assets/images/ingredients/vegetable.svg';
import WaterIcon from '@/assets/images/ingredients/water.svg';
import WatermelonIcon from '@/assets/images/ingredients/watermelon.svg';
import ZucchiniIcon from '@/assets/images/ingredients/zucchini.svg';

export type IngredientIconComponent = FC<SvgProps>;

export const INGREDIENT_ICON_COMPONENTS: Record<string, IngredientIconComponent> = {
  anchovy: AnchovyIcon,
  apple: AppleIcon,
  asparagus: AsparagusIcon,
  avocado: AvocadoIcon,
  bacon: BaconIcon,
  banana: BananaIcon,
  basil: BasilIcon,
  bean_sprout: BeanSproutIcon,
  beef: BeefIcon,
  blueberry: BlueberryIcon,
  bell_pepper: BellPepperIcon,
  bokchoy: BokchoyIcon,
  broccoli: BroccoliIcon,
  butter: ButterIcon,
  cabbage: CabbageIcon,
  carrot: CarrotIcon,
  celery: CeleryIcon,
  cheddar_cheese: CheeseIcon,
  cheese: CheeseIcon,
  chicken: ChickenIcon,
  cream_cheese: CheeseIcon,
  chicken_breast: ChickenIcon,
  chicken_thigh: ChickenIcon,
  cheongyang_chili: ChiliIcon,
  chive: AsparagusIcon,
  chili: ChiliIcon,
  cilantro: SpinachIcon,
  abalone: ClamIcon,
  clam: ClamIcon,
  mussel: ClamIcon,
  coconut: CoconutIcon,
  corn: CornIcon,
  crab: CrabIcon,
  cranberry: CranberryIcon,
  cucumber: CucumberIcon,
  dragon_fruit: DragonFruitIcon,
  dairy_processed: DairyProcessedIcon,
  duck: DuckIcon,
  dumpling: DumplingIcon,
  egg: EggIcon,
  eggplant: EggplantIcon,
  etc: EtcIcon,
  dried_pollack: FishIcon,
  fish: FishIcon,
  fruit: FruitIcon,
  garlic: GarlicIcon,
  garlic_chive: AsparagusIcon,
  minced_garlic: GarlicIcon,
  grape: GrapeIcon,
  grapefruit: GrapefruitIcon,
  greek_yogurt: CreamIcon,
  ham: SalamiIcon,
  homemade: HomemadeIcon,
  ketchup: KetchupIcon,
  kimchi: KimchiIcon,
  kiwi: KiwiIcon,
  kelp: SeaweedIcon,
  lamb: LambIcon,
  lemon: LemonIcon,
  lettuce: LettuceIcon,
  lime: LimeIcon,
  lobster: LobsterIcon,
  mandarin: MandarinIcon,
  mango: MangoIcon,
  melon: MelonIcon,
  milk: MilkIcon,
  mung_bean_sprout: BeanSproutIcon,
  mushroom: MushroomIcon,
  mustard: MustardIcon,
  napa_cabbage: CabbageIcon,
  octopus: SquidIcon,
  octopus_large: SquidIcon,
  olive: OliveIcon,
  onion: OnionIcon,
  orange: OrangeIcon,
  peach: PeachIcon,
  pear: PearIcon,
  peas: PeasIcon,
  parsley: ParsleyIcon,
  perilla_leaf: PerillaLeafIcon,
  persimmon: PersimmonIcon,
  plum: PlumIcon,
  pomegranate: PomegranateIcon,
  pineapple: PineappleIcon,
  pork: PorkIcon,
  pork_belly: PorkIcon,
  pork_jowl: PorkIcon,
  pork_neck: PorkIcon,
  potato: PotatoIcon,
  pumpkin: PumpkinIcon,
  radish: RadishIcon,
  raspberry: RaspberryIcon,
  salt: SaltIcon,
  sausage: SausageIcon,
  scallion: ScallionIcon,
  scallop: ClamIcon,
  seasoning: SeasoningIcon,
  seaweed: SeaweedIcon,
  sesame_oil: SesameOilIcon,
  shrimp: ShrimpIcon,
  soy_sauce: SoySauceIcon,
  spinach: SpinachIcon,
  squid: SquidIcon,
  strawberry: StrawberryIcon,
  sugar: SugarIcon,
  sweet_potato: SweetPotatoIcon,
  tangerine: MandarinIcon,
  tofu: TofuIcon,
  tomato: TomatoIcon,
  tuna_can: CannedIcon,
  vegetable: VegetableIcon,
  water: WaterIcon,
  water_dropwort: BeanSproutIcon,
  watermelon: WatermelonIcon,
  whipping_cream: CreamIcon,
  yogurt: CreamIcon,
  zucchini: ZucchiniIcon,
  // 새로 추가된 조미료 - 기본 조미료 아이콘 사용
  honey: SeasoningIcon,
  anchovy_sauce: SeasoningIcon,
  coarse_salt: SeasoningIcon,
  ground_sesame: SeasoningIcon,
  teriyaki_sauce: SeasoningIcon,
  tonkatsu_sauce: SeasoningIcon,
  anchovy_fish_sauce: SeasoningIcon,
  corn_syrup: SeasoningIcon,
  msg: SeasoningIcon,
  dashida: SeasoningIcon,
  ssamjang: SeasoningIcon,
  oligodang: SeasoningIcon,
  olive_oil: SeasoningIcon,
  jajang_powder: SeasoningIcon,
  cheonggukjang: SeasoningIcon,
  chogochujang: ChiliIcon,
  chunjang: SeasoningIcon,
  chili_sauce: SeasoningIcon,
  hot_sauce: SeasoningIcon,
  // 고추 관련 조미료 - 고추 아이콘 사용
  gochujang: ChiliIcon,
  red_pepper_powder: ChiliIcon,
};

