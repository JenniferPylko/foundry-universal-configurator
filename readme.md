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

this module has 2 main conceptual structures: overloads and patches. an overload defines what object we are going to edit, and patches are individual properties. to get started, click the "add overload button"

![image](https://github.com/JenniferPylko/foundry-universal-configurator/assets/3450413/2d9e72d3-b9b5-498a-9860-d5e63a71d38c)

an overload has a number of options:
 - the key path (what object to edit, starting with a property of globalThis and specified as keys separated by a "." character. you can use numbers in the path to traverse arrays)
 - the overload type (i've only tested object so far. array should work, but i haven't encountered a scenario where i can use it yet)
 - document types to reset (this causes foundry to re-initialize these document types, effectively applying your patches. this may not be necessary if you are patching values during the proper hooks)
 - 0 or more patches

![image](https://github.com/JenniferPylko/foundry-universal-configurator/assets/3450413/720433e0-3855-4cc6-b2d0-2e34101cc127)

each patch specifies the following:
 - a key (if in object mode)
 - a type (this is not enforced, so you can intentionally use the wrong type to your advantage if necessary)
 - a patch strategy (different strategies are available to different types)
 - a value, specified as json (some patch strategies ignore this)

![image](https://github.com/JenniferPylko/foundry-universal-configurator/assets/3450413/307289b5-1fd6-4a8c-85c2-98976a2ba1b8)

NOTE: i've only been able to thoroughly test the fallback, delete, and replace strategies so far. check out [the patcher](./js/patcher.mjs) to learn about all the available strategies.

TODO: list and explain all patch strategies here
