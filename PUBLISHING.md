# Publishing Guide

This document outlines the steps required to publish a new version of the package.

## Version Publishing Steps

### 1. Implement features and commit them

- Develop new features, bug fixes, or improvements
- Write tests for new functionality
- Ensure all tests pass by running `npm test`
- Commit your changes to the repository

### 2. Bump version (in a separate commit)

- Update the version in `package.json` according to [Semantic Versioning](https://semver.org/):
  - MAJOR version for incompatible API changes
  - MINOR version for backward-compatible functionality additions
  - PATCH version for backward-compatible bug fixes
- Update the CHANGELOG.md file with a new entry that includes:
  - The new version number and release date
  - A summary of all changes compared to the previous version
  - Group changes by type (e.g., "Features", "Bug Fixes", "Breaking Changes")
  - Reference relevant issue/PR numbers when applicable
  - Example:
    ```
    ## [1.2.3] - 2025-05-06
    
    ### Features
    - Added new array utility function for deep comparison (#42)
    
    ### Bug Fixes
    - Fixed edge case in retry.ts when handling network errors (#45)
    
    ### Documentation
    - Improved JSDoc comments for random-functions.ts
    ```
- You can use npm commands to update the version:
  ```
  npm version patch # for bug fixes
  npm version minor # for new features
  npm version major # for breaking changes
  ```
- Alternatively, update the version manually in `package.json` and commit it

- Run the pre-publish script to verify everything is ready:
  ```
  npm run prepublishOnly
  ```

### 3. Add git tag and push to origin

- Create a git tag matching the new version:
  ```
  git tag v1.2.3 # Replace with your actual version number
  ```
- Push your changes to the remote repository:
  ```
  git push origin main # or your branch name
  ```
- Push the tag to the remote repository:
  ```
  git push origin v1.2.3 # Replace with your actual version tag
  ```

### 4. Publish to npm

- Ensure you're logged in to npm:
  ```
  npm login
  ```
- Publish the package:
  ```
  npm publish
  ```

## Notes

- Make sure all tests are passing before publishing
- Ensure the package builds correctly by running `npm run build` before publishing
- Consider using `git log v1.1.0..HEAD --oneline` to review changes since the previous version when updating the CHANGELOG