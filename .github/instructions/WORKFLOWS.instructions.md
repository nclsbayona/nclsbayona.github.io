---
applyTo: .github/workflows/*.yml
---

# Workflows Instructions for nclsbayona.github.io

## Purpose
The purpose of this document is to provide guidelines and best practices for creating and maintaining GitHub Actions workflows in the nclsbayona.github.io repository. These workflows are essential for automating tasks such as building, testing, and deploying the Hugo-based blog.

## Workflow Context
The workflows in this repository are designed to support the development, deployment and maintenance of the Hugo-based blog. They include tasks for building the site, running tests, and deploying changes to GitHub Pages. Understanding the context in which these workflows operate is crucial for making effective modifications and improvements.

## Guidelines for Workflow Creation and Maintenance
- **Clarity and Readability**: Ensure that workflow files are well-organized and include comments where necessary to explain complex steps or decisions.
- **Efficiency**: Optimize workflows to minimize execution time and resource usage. Avoid redundant steps and leverage caching where appropriate.
- **Security**: Follow best practices for security, such as using secrets for sensitive information and limiting permissions to only what is necessary.
- **Error Handling**: Implement robust error handling to ensure that workflows can gracefully handle failures and
provide meaningful feedback.
- **Testing**: Regularly test workflows to ensure they function as expected, especially after making changes.
- **Documentation**: Maintain up-to-date documentation for each workflow, including its purpose, triggers, and any dependencies.
- **Version Control**: Use version control effectively to track changes to workflow files and facilitate collaboration.
- **Compliance with Repository Standards**: Ensure that all workflows adhere to the overall standards and practices established for the repository, including naming conventions and file structure.
- **Regular Maintenance**: Periodically review and update workflows to ensure they remain effective and aligned with project goals.