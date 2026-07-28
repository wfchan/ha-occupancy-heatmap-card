# Searchable Entity Picker Design

## Goal

Replace the card editor's closed entity dropdown with Home Assistant's native searchable entity picker so users can type an entity ID or name, filter existing entities, and select the intended entity.

## Interface

- Render `ha-entity-picker` in the existing Source section.
- Pass the current Home Assistant object through its `hass` property.
- Pass the configured entity ID through its `value` property.
- Handle `value-changed` and emit the existing `config-changed` event with the selected entity ID.
- Do not enable arbitrary custom entity IDs; selection remains limited to entities available in Home Assistant.
- Keep the existing Entity label, editor spacing, themes, and the rest of the configuration controls unchanged.

## Compatibility

Home Assistant supplies `ha-entity-picker` when the visual card editor runs. The mocked dashboard does not render the editor, so it does not need a local picker implementation.

## Verification

- Component tests verify the native picker receives `hass` and the configured entity ID.
- Component tests dispatch `value-changed` and verify the selected ID is emitted in `config-changed`.
- Existing editor, type-check, build, and browser suites remain green.
