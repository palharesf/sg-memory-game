/**
 * Image pool for the memory game.
 *
 * Source: https://game-icons.net
 * License: Creative Commons 3.0 BY (CC0 where noted)
 *
 * TO ADD IMAGES: add an entry to the `POOL` array below and drop the file into
 *   public/images/000000/transparent/1x1/{author}/{name}.png
 *
 * TO REMOVE IMAGES: comment out the entry in `POOL` (don't delete — keeps history).
 *
 * Author keys must match a key in `AUTHORS`.
 */

const BASE = "/images/000000/transparent/1x1";

// ---------------------------------------------------------------------------
// Author registry — update if new contributors are added
// ---------------------------------------------------------------------------

export interface Author {
  key: string;
  displayName: string;
  url: string | null;
}

export const AUTHORS: Record<string, Author> = {
  lorc: {
    key: "lorc",
    displayName: "Lorc",
    url: "http://lorcblog.blogspot.com",
  },
  delapouite: {
    key: "delapouite",
    displayName: "Delapouite",
    url: "https://delapouite.com",
  },
  sbed: {
    key: "sbed",
    displayName: "Sbed",
    url: "http://opengameart.org/content/95-game-icons",
  },
  skoll: {
    key: "skoll",
    displayName: "Skoll",
    url: null,
  },
  "lord-berandas": {
    key: "lord-berandas",
    displayName: "Lord Berandas",
    url: "http://berandas.deviantart.com",
  },
  andymeneely: {
    key: "andymeneely",
    displayName: "Andy Meneely",
    url: "http://www.se.rit.edu/~andy/",
  },
  darkzaitzev: {
    key: "darkzaitzev",
    displayName: "DarkZaitzev",
    url: "http://darkzaitzev.deviantart.com",
  },
  "various-artists": {
    key: "various-artists",
    displayName: "Various Artists",
    url: "https://game-icons.net",
  },
};

// ---------------------------------------------------------------------------
// Pool entry
// ---------------------------------------------------------------------------

export interface PoolImage {
  /** Absolute path from public root, ready to use in <img src> */
  path: string;
  /** Author key — must match a key in AUTHORS */
  authorKey: string;
  /** Human-readable icon name derived from filename */
  name: string;
}

function img(author: string, file: string): PoolImage {
  const name = file.replace(/\.png$/, "").replace(/-/g, " ");
  return { path: `${BASE}/${author}/${file}`, authorKey: author, name };
}

// ---------------------------------------------------------------------------
// The pool
// ---------------------------------------------------------------------------

export const POOL: PoolImage[] = [
  // andymeneely
  // img("andymeneely", "police-badge.png"),

  // darkzaitzev
  img("darkzaitzev", "chameleon-glyph.png"),

  // delapouite
  img("delapouite", "all-seeing-eye.png"),
  // img("delapouite", "akhet.png"),
  // img("delapouite", "anarchy.png"),
  // img("delapouite", "aquarius.png"),
  // img("delapouite", "aries.png"),
  img("delapouite", "azul-flake.png"),
  img("delapouite", "banknote.png"),
  img("delapouite", "bowen-knot.png"),
  // img("delapouite", "caduceus.png"),
  img("delapouite", "camargue-cross.png"),
  // img("delapouite", "cancer.png"),
  // img("delapouite", "capricorn.png"),
  // img("delapouite", "check-mark.png"),
  img("delapouite", "cornucopia.png"),
  img("delapouite", "corporal.png"),
  // img("delapouite", "credits-currency.png"),
  img("delapouite", "dream-catcher.png"),
  img("delapouite", "dwennimmen.png"),
  img("delapouite", "easter-egg.png"),
  // img("delapouite", "ermine.png"),
  // img("delapouite", "eye-of-horus.png"),
  // img("delapouite", "f-clef.png"),
  img("delapouite", "fallout-shelter.png"),
  // img("delapouite", "female.png"),
  // img("delapouite", "film-strip.png"),
  img("delapouite", "fleur-de-lys.png"),
  // img("delapouite", "flower-emblem.png"),
  img("delapouite", "freemasonry.png"),
  // img("delapouite", "g-clef.png"),
  // img("delapouite", "gear-stick-pattern.png"),
  // img("delapouite", "gemini.png"),
  img("delapouite", "hades-symbol.png"),
  img("delapouite", "hell-crosses.png"),
  img("delapouite", "heptagram.png"),
  img("delapouite", "hieroglyph-y.png"),
  img("delapouite", "horseshoe.png"),
  img("delapouite", "info.png"),
  img("delapouite", "jerusalem-cross.png"),
  img("delapouite", "klingon.png"),
  img("delapouite", "lambda.png"),
  // img("delapouite", "leo.png"),
  img("delapouite", "liberty-wing.png"),
  // img("delapouite", "libra.png"),
  // img("delapouite", "logic-gate-and.png"),
  // img("delapouite", "logic-gate-nand.png"),
  // img("delapouite", "logic-gate-nor.png"),
  // img("delapouite", "logic-gate-not.png"),
  // img("delapouite", "logic-gate-nxor.png"),
  // img("delapouite", "logic-gate-or.png"),
  // img("delapouite", "logic-gate-xor.png"),
  // img("delapouite", "male.png"),
  img("delapouite", "mona-lisa.png"),
  img("delapouite", "nested-hexagons.png"),
  img("delapouite", "ophiuchus.png"),
  // img("delapouite", "peace-dove.png"),
  // img("delapouite", "pisces.png"),
  img("delapouite", "rod-of-asclepius.png"),
  // img("delapouite", "rss.png"),
  img("delapouite", "rub-el-hizb.png"),
  // img("delapouite", "sagittarius.png"),
  // img("delapouite", "scorpio.png"),
  img("delapouite", "slumbering-sanctuary.png"),
  // img("delapouite", "stop-sign.png"),
  img("delapouite", "striped-sun.png"),
  // img("delapouite", "taurus.png"),
  img("delapouite", "transform.png"),
  img("delapouite", "triforce.png"),
  img("delapouite", "trinacria.png"),
  img("delapouite", "triquetra.png"),
  img("delapouite", "venus-of-willendorf.png"),
  // img("delapouite", "virgo.png"),
  img("delapouite", "virtual-marker.png"),
  img("delapouite", "wanted-reward.png"),
  img("delapouite", "warlock-eye.png"),
  img("delapouite", "yin-yang.png"),
  // img("delapouite", "zigzag-hieroglyph.png"),
  img("delapouite", "ancient-screw.png"),
  img("delapouite", "boomerang.png"),
  img("delapouite", "boss-key.png"),
  img("delapouite", "bug-net.png"),
  img("delapouite", "cape.png"),
  img("delapouite", "deku-tree.png"),
  img("delapouite", "fish-monster.png"),
  img("delapouite", "fishing-pole.png"),
  img("delapouite", "koholint-egg.png"),
  img("delapouite", "nested-hearts.png"),
  img("delapouite", "ocarina.png"),
  img("delapouite", "rupee.png"),
  img("delapouite", "slingshot.png"),
  img("delapouite", "sword-altar.png"),

  // lorc
  // img("lorc", "ace.png"),
  img("lorc", "aerial-signal.png"),
  // img("lorc", "ankh.png"),
  img("lorc", "artificial-hive.png"),
  img("lorc", "automatic-sas.png"),
  img("lorc", "barbed-sun.png"),
  img("lorc", "batwing-emblem.png"),
  img("lorc", "biohazard.png"),
  img("lorc", "black-flag.png"),
  // img("lorc", "checkbox-tree.png"),
  img("lorc", "clover.png"),
  img("lorc", "coiling-curl.png"),
  img("lorc", "concentric-crescents.png"),
  img("lorc", "condor-emblem.png"),
  // img("lorc", "conversation.png"),
  img("lorc", "cubeforce.png"),
  // img("lorc", "cubes.png"),
  img("lorc", "cursed-star.png"),
  // img("lorc", "cycle.png"),
  img("lorc", "divided-spiral.png"),
  img("lorc", "eagle-emblem.png"),
  img("lorc", "fluffy-trefoil.png"),
  img("lorc", "freedom-dove.png"),
  img("lorc", "gamepad-cross.png"),
  img("lorc", "gothic-cross.png"),
  img("lorc", "hawk-emblem.png"),
  // img("lorc", "hazard-sign.png"),
  // img("lorc", "holy-symbol.png"),
  // img("lorc", "hospital-cross.png"),
  // img("lorc", "interdiction.png"),
  img("lorc", "james-bond-aperture.png"),
  // img("lorc", "justice-star.png"),
  // img("lorc", "king.png"),
  img("lorc", "laser-warning.png"),
  img("lorc", "law-star.png"),
  img("lorc", "maze-cornea.png"),
  img("lorc", "maze-saw.png"),
  // img("lorc", "moebius-star.png"),
  img("lorc", "moebius-trefoil.png"),
  img("lorc", "moebius-triangle.png"),
  // img("lorc", "omega.png"),
  img("lorc", "orbital.png"),
  // img("lorc", "over-infinity.png"),
  // img("lorc", "pentagram-rose.png"),
  img("lorc", "perpendicular-rings.png"),
  // img("lorc", "radial-balance.png"),
  img("lorc", "radioactive.png"),
  // img("lorc", "recycle.png"),
  // img("lorc", "ribbon.png"),
  img("lorc", "rss.png"),
  img("lorc", "rune-sword.png"),
  // img("lorc", "scales.png"),
  // img("lorc", "shiny-omega.png"),
  img("lorc", "shuriken-aperture.png"),
  img("lorc", "skull-crossed-bones.png"),
  img("lorc", "staryu.png"),
  img("lorc", "steelwing-emblem.png"),
  img("lorc", "totem-head.png"),
  img("lorc", "triorb.png"),
  // img("lorc", "triple-beak.png"),
  // img("lorc", "triple-corn.png"),
  // img("lorc", "triple-plier.png"),
  img("lorc", "triple-yin.png"),
  img("lorc", "ubisoft-sun.png"),
  img("lorc", "zigzag-cage.png"),
  img("lorc", "broadsword.png"),
  img("lorc", "candle-holder.png"),
  img("lorc", "compass.png"),
  img("lorc", "evil-comet.png"),
  img("lorc", "fairy.png"),
  img("lorc", "half-heart.png"),
  img("lorc", "masked-spider.png"),
  img("lorc", "meat.png"),
  img("lorc", "pocket-bow.png"),
  img("lorc", "unlit-bomb.png"),

  // lord-berandas
  img("lord-berandas", "holosphere.png"),
  img("lord-berandas", "power-button.png"),

  // sbed
  // img("sbed", "cancel.png"),
  // img("sbed", "clover-spiked.png"),
  // img("sbed", "clover.png"),
  // img("sbed", "doubled.png"),
  // img("sbed", "expander.png"),
  // img("sbed", "help.png"),
  // img("sbed", "hive.png"),
  img("sbed", "mass-driver.png"),
  // img("sbed", "nodular.png"),
  // img("sbed", "nuclear.png"),
  // img("sbed", "overmind.png"),
  // img("sbed", "pulse.png"),
  // img("sbed", "reactor.png"),
  img("sbed", "regeneration.png"),
  // img("sbed", "slow-blob.png"),
  // img("sbed", "spawn-node.png"),

  // skoll
  // img("skoll", "air-force.png"),
  // img("skoll", "allied-star.png"),
  // img("skoll", "balkenkreuz.png"),
  // img("skoll", "bat.png"),
  // img("skoll", "clubs.png"),
  // img("skoll", "diamonds.png"),
  // img("skoll", "divided-square.png"),
  // img("skoll", "hearts.png"),
  // img("skoll", "iron-cross.png"),
  // img("skoll", "pentacle.png"),
  // img("skoll", "spades.png"),

  // various-artists
  // img("various-artists", "infinity.png"),
];

/** Total number of images available in the pool */
export const POOL_SIZE = POOL.length;

// ---------------------------------------------------------------------------
// Donated art helpers — separate path from game-icons.net assets
// ---------------------------------------------------------------------------

const DONATED_BASE = "/images/donated";

/**
 * Use this helper for donated images, NOT img().
 * Files go in public/images/donated/{filename}.png
 * Add the donor to AUTHORS with their SteamGifts URL.
 *
 * Example:
 *   donatedImg("adam1224", "my-artwork.png")
 *   // → AUTHORS entry: { key: "adam1224", displayName: "adam1224", url: "https://www.steamgifts.com/user/adam1224" }
 */
function donatedImg(author: string, file: string): PoolImage {
  const name = file.replace(/\.png$/, "").replace(/-/g, " ");
  return { path: `${DONATED_BASE}/${file}`, authorKey: author, name };
}

// Suppress unused warning until first donation arrives
void donatedImg;

/**
 * Community-donated art pool — locked until enough art is collected.
 * To add: drop 512×512 transparent PNG into public/images/donated/, add entry
 * below using donatedImg(), and add the donor to AUTHORS above.
 */
export const DONATED_POOL: PoolImage[] = [];

export const DONATED_POOL_SIZE = DONATED_POOL.length;
