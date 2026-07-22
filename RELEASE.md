# Releasing parse-address

Stable releases are cut from `main` and tagged `vX.Y.Z`.

## Cutting 3.0.0

1. **Land the code on `main`.** Merge the release branch (the CA work plus the
   v1 fixes) into `main`. `main` must contain the 3.0 code, or the published
   package is not reproducible from a tag.
2. **Set the version.** In `package.json`, set `"version": "3.0.0"` (drop any
   `-beta` suffix). Commit.
3. **Verify.**
   ```bash
   npm install
   npm run build
   npx jest        # all green, incl. token-preservation
   ```
4. **Tag.**
   ```bash
   git tag v3.0.0
   git push origin main --tags
   ```
5. **Publish.**
   ```bash
   npm publish
   ```
6. **Fix the dist-tag.**
   ```bash
   npm dist-tag add @sroussey/parse-address@3.0.0 latest
   ```
   Until 3.0.0 is published, point `latest` back at the last stable so fresh
   installs do not pull a beta:
   ```bash
   npm dist-tag add @sroussey/parse-address@2.4.2 latest
   ```
   Optionally keep the beta on a prerelease channel:
   ```bash
   npm dist-tag add @sroussey/parse-address@3.0.0-beta1 next
   ```

## Prerelease

Publish prereleases with an explicit tag so they never become `latest`:
```bash
npm publish --tag next
```
