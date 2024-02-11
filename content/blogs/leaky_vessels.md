<h1>Leaky Vessels vulnerabilities</h1>

<details name="section">
<summary><h2>Contents</h2></summary>
  <ol>
    <li>Definition (What is Leaky Vessels?)</li>
    <li>Importance (Why is knowing about Leaky Vessels important?)</li>
    <li>
      <details name="section-vulnerabilities">
        <summary>Explanation of each vulnerability (Names taken from <a href="https://github.com/snyk/leaky-vessels-dynamic-detector">leaky-vessels-dynamic-detector</a>)</summary>
        <ol>
          <li>runc process.cwd & Leaked fds Container Breakout [CVE-2024-21626]</li>
          <li>Buildkit Mount Cache Race: Build-time Race Condition Container Breakout [CVE-2024-23651]</li>
          <li>Buildkit GRPC SecurityMode Privilege Check [CVE-2024-23653]</li>
          <li>Buildkit Build-time Container Teardown Arbitrary Delete [CVE-2024-23652]</li>
        </ol>
      </details>
    </li>
    <li>Mitigations (What can I do?)</li>
  </ol>
</details>

<hr />

<details name="section">
  <summary><h3>Definition (What is Leaky Vessels?)</h3></summary>
  <div>
    Leaky Vessels is the name given to a set of vulnerabilities discovered and reported by Snyk on 2023 but publically-listed on January 31, 2024. This set of vulnerabilities allow an attacker to escape a containerized environment and is made-uo of four vulnerabilities that target different parts of the docker architecture. <img src="https://i.stack.imgur.com/lAtSR.png" />
  </div>
  <br />
</details>

<details name="section">
  <summary><h3>Importance (Why is knowing about Leaky Vessels important?)</h3></summary>
  <div>
    Knowing about Leaky Vessels vulnerabilities is important because Containers are a technology used frequently on the Industry and getting to know threats you might face allow you to prepare better than someone that is just unaware of what can actually happen.
  </div>
  <br />
</details>

<details name="section">
  <summary><h3>Explanation of each vulnerability (Names taken from <a href="https://github.com/snyk/leaky-vessels-dynamic-detector">leaky-vessels-dynamic-detector</a>)</h3></summary>
    <ol>
      <li>
        <details name="section-vulnerabilities">
          <summary><h4>runc process.cwd & Leaked fds Container Breakout [CVE-2024-21626]</h4></summary>
          Manipulation of a newly spawned process' current working directory (process.cwd). This uses a file descriptor (https://www.golinuxcloud.com/linux-file-descriptors/) leak that allows an attacker to have a working directory in the host filesystem namespace (An fd is open on the current working directory so it can be used to escape a containerized environment.
          <a href="https://youtu.be/YuWvmQ9WIhw">Watch Video Here!</a>
          <br />
        </details>
      </li>
      <li>
        <details name="section-vulnerabilities">
          <summary><h4>Buildkit Mount Cache Race: Build-time Race Condition Container Breakout [CVE-2024-23651]</h4></summary>
          Buildkit offers cache volumes using the RUN --mount=type=cache directive in a Dockerfile, which allows for the mounting of a persistent directory at a controlled location during Docker image build. This functionality is intended to help improve the performance of tooling, such as package managers, by keeping the persistent cache between builds. (https://snyk.io/blog/cve-2024-23651-docker-buildkit-mount-cache-race/)
          The RUN command supports a specialized cache, which you can use when you need a more fine-grained cache between runs. For example, when installing packages, you don't always need to fetch all of your packages from the internet each time. You only need the ones that have changed.
To solve this problem, you can use RUN --mount type=cache. For example, for your Debian-based image you might use the following:
          
          RUN \
    --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y git
    
  Using the explicit cache with the --mount flag keeps the contents of the target directory preserved between builds. When this layer needs to be rebuilt, then it'll use the apt cache in /var/cache/apt.
    
  Basically there's a delay between the checking of the existance of the directory and the syscall to mount it, so it's possible to modify the directory to be a symlink and game over.
          <br />
        </details>
      </li>
      <li>
        <details name="section-vulnerabilities">
          <summary><h4>Buildkit GRPC SecurityMode Privilege Check [CVE-2024-23653]</h4></summary>
          This occurs because the GRPC API used by buildkit to schedule container creation from an image has a security flaw since it does not strictly check for authorization to create privileged containers.
          <br />
        </details>
      </li>
      <li>
        <details name="section-vulnerabilities">
          <summary><h4>Buildkit Build-time Container Teardown Arbitrary Delete [CVE-2024-23652]</h4></summary>
          This attack allows an attacker to delete files from the host OS by deleting contents in a symbolic link directory mounted.
        </details>
      </li>
    </ol>
  <br />
</details>

<details name="section">
  <summary><h3>Mitigations (What can I do?)</h3></summary>
  <br />
  <ul>
    <li>
      Use <a href="https://docs.docker.com/engine/alternative-runtimes/">other container runtime</a> (Maybe try <a href="https://github.com/containers/crun">crun</a>). Also, you can try <a href="https://podman.io">Podman</a>
      <img src="https://github.com/nclsbayona/leaky-vessels/blob/master/podman-vs-docker.png?raw=true" />
    </li>
    <li>Use official Docker builds</li>
    <li>Update constantly</li>
  </ul>
</details>
