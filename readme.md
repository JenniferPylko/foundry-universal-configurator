# jenny's foundry universal configurator

this module is completely system agnostic and can patch any descendent property of globalThis during any hook ("init" or later) and then optionally reload specified types of world documents to reflect those changes.

this module is *very* dangerous and can make your world unloadable (possibly even in safe mode). if you're looking to customize foundry or a foundry system/module, here are some modules i'd recommend trying before resorting to this one:
 - https://foundryvtt.com/packages/advanced-macros
 - https://foundryvtt.com/packages/chris-premades
 - https://foundryvtt.com/packages/custom-character-sheet-sections
 - https://foundryvtt.com/packages/dae
 - https://foundryvtt.com/packages/dnd5e-custom-counters
 - https://foundryvtt.com/packages/dnd5e-custom-skills
 - https://foundryvtt.com/packages/downtime-dnd5e
 - https://foundryvtt.com/packages/itemacro
 - https://foundryvtt.com/packages/launchmacro
 - https://foundryvtt.com/packages/midi-qol
 - https://foundryvtt.com/packages/polyglot
 - https://foundryvtt.com/packages/prime-psionics
 - https://foundryvtt.com/packages/resourcesplus
 - https://foundryvtt.com/packages/rest-recovery
 - https://foundryvtt.com/packages/wjmais
 - https://foundryvtt.com/packages/world-currency-5e

this module optionally supports using codemirror for editing json values.

NOTE: if you pop out this module's settings window with PopOut! you won't be able to save the settings. this is 100% on my end to fix, so don't file any bug reports with PopOut!

TODO: add images to describe how this works