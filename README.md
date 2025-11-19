<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AntonioIonica/pomonow">
    <img src="./public/logo-light.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Tomatoro</h3>

  <p align="center">
    Pomodoro To Do app with integrated AI to estimate the necessary time to complete each task
    <br />
    <a href="https://github.com/AntonioIonica/pomonow"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AntonioIonica/pomonow">View Demo</a>
    &middot;
    <a href="https://github.com/AntonioIonica/pomonow/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/AntonioIonica/pomonow/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![PomoNow][product-screenshot]](https://ibb.co/DD7bXPzX)

Another tutorial project where I followed James Schmedtmann guide with the goal of learning multiple technologies. 
Hotel management platform with closed account creation for the employees. They manage the guests check in and check out and create records of cabins.

Key features:
  - hotel employees can login, as there is no register page-only employees can access the platform
  - visual statistics for bookings, cabins
  - real time update of cabins using Supabase
  - account setting for employees
  - managing cabins
  - dark mode

Topics I learned: 
  - authentication and authorization using Supabase
  - state management using React Query
  - dark mode
  - data visualization using Recharts
  - React hot toast

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* React [![React][react.dev]][React-url]
* Next
* Gemini 
* Tailwind CSS

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites


* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/AntonioIonica/pomonow
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

4. Get an API from Gemini AI (model gemini 2.5 flash) and set it in .env.local as GEMINI_API_KEY

5. Start the project
   ``` sh
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

I use the website on daily pattern, as a task manager and also pomodoro timer to know when to take a break from coding


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] daily streaks
- [x] random quotes


See the [open issues](https://github.com/AntonioIonica/pomonow/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

-

<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@X](https://twitter.com/AntonioIonica) - antonioionica@gmail.com

Project Link: [Github](https://github.com/AntonioIonica/pomonow)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/AntonioIonica/pomonow.svg?style=for-the-badge
[contributors-url]: https://github.com/AntonioIonica/pomonow/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AntonioIonica/pomonow.svg?style=for-the-badge
[forks-url]: https://github.com/AntonioIonica/pomonow/network/members
[stars-shield]: https://img.shields.io/github/stars/AntonioIonica/pomonow.svg?style=for-the-badge
[stars-url]: https://github.com/AntonioIonica/pomonow/stargazers
[issues-shield]: https://img.shields.io/github/issues/AntonioIonica/pomonow.svg?style=for-the-badge
[issues-url]: https://github.com/AntonioIonica/pomonow/issues
[license-shield]: https://img.shields.io/github/license/AntonioIonica/pomonow.svg?style=for-the-badge
[license-url]: https://github.com/AntonioIonica/pomonow/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/antonio-iulian-ionica-478074353/
[product-screenshot]: ./public/project_screenshot.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[react.dev]: https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev 
[react.dev]: https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev 

