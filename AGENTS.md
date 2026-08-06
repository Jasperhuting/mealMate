# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Automatically publish OTA-compatible changes

After implementing user-requested code changes and completing the relevant checks successfully,
automatically publish OTA-compatible changes to the iOS `production` channel with EAS Update.
Do not ask for confirmation again. Use a concise update message that describes the change.

Only publish changes that are compatible with the existing native runtime. JavaScript, styling, and
bundled asset changes are normally OTA-compatible. If native dependencies, native configuration, or
the runtime version changed, do not publish them through OTA; clearly state that a new TestFlight
build is required.

If an OTA-compatible feature requires a database migration, apply and verify the migration before
publishing the OTA update. Never publish when required checks or migrations fail.
