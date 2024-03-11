# Reminiscent

## Description

A chat application that lets you talk to a person you wish to talk to.

## Table of Contents

-   [Reminiscent](#reminiscent)
    -   [Description](#description)
    -   [Table of Contents](#table-of-contents)
    -   [Getting Started](#getting-started)
    -   [Usage](#usage)
    -   [Contributing](#contributing)
        -   [Guidelines](#guidelines)
    -   [License](#license)
    -   [Contact](#contact)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

If you wish to run Next.js and Flask separately, then you can do so by running these commands:

```bash
# next.js
npm run next-dev

# flask
pnpm run flask-dev
```

## Usage

This code leverages context providers to ensure accessibility of crucial information such as chat history, user names, files, and themes across the application.

With every new message sent, the updated chat history is transmitted to the backend API endpoint. This approach is intentional; none of the data is stored persistently within the application.

This measure is taken to uphold the security and privacy of the transmitted information.

## Contributing

Thank you for considering contributing to this project! To contribute, please follow these steps:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3. Make your changes and test them thoroughly.
4. Commit your changes: `git commit -m 'Add some feature'`.
5. Push to the branch: `git push origin feature/your-feature-name`.
6. Submit a pull request detailing your changes.

### Guidelines

-   Follow the existing code style and conventions.
-   Make sure your code is well-documented.
-   Write clear commit messages.
-   Test your changes before submitting a pull request.
-   Be respectful to others and their contributions.

## License

This project is licensed under the MIT License - see the ([LICENSE](https://github.com/zaid-ahmad/reminiscent/blob/main/LICENSE)) file for details.

## Contact

If you have any questions or concerns, feel free to contact Zaid Ahmad at [zaidd250@gmail.com](mailto:zaidd250@gmail.com). You can also open an issue on the repository.
