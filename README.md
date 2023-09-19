# Host Blocker

## Manifest File (`manifest.json`)

- `manifest_version` specifies the version of the manifest file
- `name` defines the name of the extension
- `version` specifies the extension version
- `default_popup` points to the HTML file to be displated whenn the extension icon is displayed
- `permissions` list the required permissions for the extensions
- `background` specifies the background script to handle extension functionality
- `declarative_net_request` is used to block or modify network requests by specifying declarative rules. This lets extensions modify network requests without intercepting them and viewing their content, thus providing more privacy.

## Static Rulesets and Rules

### Static Rulesets

A static ruleset is a set of predefined filtering rules that are determined and defined in advance. These rules are typically included with the extension and do not change without a deliberate update to the extension. They're stored in rule files in JSON format, which are indicated to the extension using the "declarative_net_request" and "rule_resources".

An extension can specify up to **50** static rulesets as part of the "rule_resources" manifest key, but only **10** of these rulesets can be enabled at a time.

```json
{
  ...
  "declarative_net_request" : {
    "rule_resources" : [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules_1.json"
    },
    ...
    ]
  }
  ...
}
```

### Rules

Static rules are specified in rule files declared in the manifest file. They define blocking or redirecting conditions for specific URLs. the `id` and `priority` keys take a number, the `action` and `condition` keys may provide several blocking and redirecting conditions.

```json
// rules_1.json
[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {"urlFilter": "google.com", "resourceTypes": ["main_frame", "script"] }
  },
    ...
]
```

## Dynamic Rulesets and Rules

Dynamic and session rulesets are managed using JavaScript while an extension is in use. There is only one each of these ruleset types. An extension can add or remove rules to them dynamically by calling `updateDynamicRules()` and `updateSessionRules()`, provided the rule limits aren't exceeded. The total number of both rules cannot exceed **5000**.

All rules use the same rules format including four fields: `id`, `priority`, `action` and `condition`.

## Updating rules

### Updating dynamic rules

`updateDynamicRules()` can be used to update the dynamic rules.

```js
// Get arrays containing new and old rules
const newRules = await getNewRules();
const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
const oldRuleIds = oldRules.map((rule) => rule.id);

// Use the arrays to update the dynamic rules
await chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: oldRuleIds,
  addRules: newRules,
});
```

### Updating static rulesets

The static rulesets defined in the manifest can be enabled and disabled at runtime given that the number of enabled static rulesets doesnot exceed the maximum number of enabled static rulesets (10). In this extension, the rulesets are disabled by default when the extension is installed (setting "Enabled" to false within the manifest file).

```js
// Get the arrays of ruleset ids to enable and disable
const enableRulesetIds = await getEnableRulesetIds();
const disableRulesetIds = await getDisableRulesetIds();

// To get the number of enabled static rules
const enabledStaticCount =
  await chrome.declarativeNetRequest.getEnabledRulesets();

// Update the enabled static rules
await chrome.declarativeNetRequest.updateEnabledRulesets({
  enableRulesetIds: enableRulesetIds,
  disableRulesetIds: disableRulesetIds,
});
```

## Installation

- Clone the repository

```bash
git clone https://github.com/rabin245/host-blocker.git
```

- Checkout to branch

```bash
git checkout extension # with dynamic rules

git checkout static-rulesets  # with static rulesets
```

- Install dependencies

```bash
yarn
```

- Run the build script

```bash
yarn build
```

Once you run the build script, dist folder is created

### Install in Browser

1. Open Chromium based Browser and goto **Extensions**
2. Enable the **Developer Mode**
3. Click the Load unpacked button.
4. Navigate to the directory where you cloned the extension repository and select the **dist** folder.
