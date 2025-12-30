---
title: Connectivity at different layers
description: This is a blog post tutorial about connectivity and networking concepts at different layers.
slug: connectivity-networking
date: 2026-01-06 08:00:00+0000
lastmod: 2026-01-07 15:00:00+0000
image: cover.webp
links:
- title: OSI Model on Wikipedia
  description: Open Systems Interconnection model article on Wikipedia.
  website: https://en.wikipedia.org/wiki/OSI_model
  image: https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Osi-model-jb.svg/640px-Osi-model-jb.svg.png
draft: true
categories:
- networking
- fundamentals
- tutorials
tags:
- devops
- devsecops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Connectivity at different layers

Have you ever looked at your machines and thought to yourself: _Great, I have this machines. But I really can't get them to talk to each other the way I want them to._ No? Just me? Alright, maybe it's just me then but I bet many of you have faced similar challenges when trying to establish connectivity between different systems, services, or applications. Because here's the thing: connectivity is a fundamental aspect of modern computing, and understanding how it works at different layers can make a huge difference in troubleshooting and optimizing your network. Sometimes, it's not just about plugging in cables or configuring IP addresses; it's about grasping the underlying principles that govern how data flows through networks because you don't always have control over all aspects of a network: Some examples of this can be found in cloud environments, complex enterprise setups or using some form of service that might probably require an specific configuration. That's ok, is just how it is. Sometimes you don't have control over everything, but understanding can help you navigate those limitations.

Now, you might be thinking:

> _Oh no, not another networking tutorial!, I hate this, bad reviews, bye-bye you loser_

Well. Leave if you want, I won't stop you. But if you stay, I promise it will be worth your time because this post is designed to be a quick and easy guide to understanding connectivity at different layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model). You don't have to be a networking expert to understand these concepts: whether you're a beginner or just need a refresher, this tutorial will grasp the essentials without overwhelming you with technical jargon and that kind of stuff.

### The OSI Model: A Quick Overview

Ok, I know what I just said about jargon, but bear with me for a moment, trust me: This will be helpful when trying to understand connectivity. The **OSI (Open Systems Interconnection)** model is a conceptual framework (Aka: _reference model_ (Not real)) that helps to standardize the functions of a telecommunication or computing system into distinct layers. Each layer serves a specific purpose and interacts with the layers directly above and below it. Now enough with the fancy talk, let's try to explain this like it's a space mission:

#### Layer 1: Physical Layer

Ok so we have our space mission. In order for our mission control to be able to communicate with the spacecraft, we need a physical medium through which we can send and receive signals. That's exactly where the **Physical Layer** comes into play: It deals with the actual hardware components, such as cables, switches, and radio frequencies that allow us to send those messages (It might also be communication from spacecraft to mission control). In space terms, this would be the antennas and transmitters that send and receive signals to and from the spacecraft.

##### Possible situations (Layer 1)

- Damaged cables or faulty hardware can disrupt communication.
- Interference in the physical medium can affect signal transmission.
- Medium (Or the actual devices) limitations can restrict data transfer rates.

##### Possible solutions (Layer 1)

- Regular maintenance and testing of physical components.
- Using error-correcting codes to mitigate interference.
- Upgrading to higher-quality cables or devices to improve performance.

#### Layer 2: Data Link Layer

Once we have the physical connection established, we need to ensure that the data being sent/received is properly formatted and error-free. This is where the **Data Link Layer** comes into play: It is responsible for establishing a reliable link between two directly connected nodes, handling error detection and correction, and managing access to the physical medium. In our space mission analogy, this layer would ensure that the messages sent from mission control to the spacecraft are correctly formatted and free of errors. 

##### Possible situations (Layer 2)

- Data frames may get corrupted during transmission.
- Collisions can occur when multiple devices try to send data simultaneously.
- Addressing issues can arise when devices are not properly identified.

##### Possible solutions (Layer 2)

- Implementing error detection and correction mechanisms.
- Using protocols like CSMA/CD to manage access to the medium.
- Ensuring proper addressing schemes are in place.

#### Layer 3: Network Layer

Now that we have a reliable link between two nodes, we need to ensure that data can be routed across multiple networks. This is where the **Network Layer** comes into play: It is responsible for determining the best path for data to travel from the source to the destination, handling logical addressing (like IP addresses), and managing traffic congestion. In our space mission analogy, this layer would ensure that messages from mission control can reach the spacecraft, even if they have to pass through multiple relay stations or satellites.

##### Possible situations (Layer 3)

- Routing issues can lead to data being sent to the wrong destination.
- Network congestion can cause delays in data transmission.
- IP address conflicts can disrupt communication.

##### Possible solutions (Layer 3)

- Implementing robust routing protocols to ensure data reaches the correct destination.
- Using Quality of Service (QoS) mechanisms to manage traffic congestion.
- Ensuring proper IP address management to avoid conflicts.

#### Layer 4: Transport Layer

Also, we need to ensure that the data being sent is delivered reliably and in the correct order. This is where the **Transport Layer** comes into play: It is responsible for end-to-end communication, ensuring that data is delivered without errors, in sequence, and without losses or duplications. In our space mission analogy, this layer would ensure that messages from mission control are received by the spacecraft in the correct order and without any missing information.

##### Possible situations (Layer 4)

- Data packets may get lost or arrive out of order.
- Connection issues can lead to interruptions in data transmission.
- Flow control problems can cause data to be sent too quickly for the receiver to handle.

##### Possible solutions (Layer 4)

- Implementing reliable transport protocols like TCP to ensure data integrity.
- Using connection management techniques to maintain stable connections.
- Implementing flow control mechanisms to regulate data transmission rates.

#### Layers 5, 6, 7: Session, Presentation, Application Layers

Finally, we need to ensure that the data being sent is meaningful and can be understood by the receiving application. This is where the **Session**, **Presentation**, and **Application** layers come into play: They are responsible for establishing, managing, and terminating sessions between applications, ensuring that data is properly formatted and presented, and providing services directly to the end-user applications. In our space mission analogy, these layers would ensure that the messages from mission control are properly formatted and understood by the spacecraft's systems. 

##### Possible situations (Layers 5, 6, 7)

- Session management issues can lead to dropped connections.
- Data format incompatibilities can cause misinterpretation of information.
- Application-level errors can disrupt communication.

##### Possible solutions (Layers 5, 6, 7)

- Implementing robust session management protocols to maintain connections.
- Using standardized data formats to ensure compatibility.
- Ensuring proper error handling at the application level.

#### Conclusion (OSI Model)

See? It wasn't that bad after all. Understanding connectivity at different layers of the OSI model can help you troubleshoot and optimize your network more effectively. By recognizing the specific challenges and solutions associated with each layer, you can better navigate the complexities of modern networking. So next time you find yourself struggling with connectivity issues, remember to think about which layer might be causing the problem and how you can address it.

### Real-World Applications

Ok, so now that we have a basic understanding of the OSI model and connectivity at different layers, let's explore some real-world applications where these concepts come into play:

#### Cloud Computing

In cloud environments, connectivity is crucial for accessing resources and services. Understanding how data flows through different layers can help optimize performance and troubleshoot issues. For example, if you're experiencing latency when accessing a cloud service, you might need to investigate the network layer for routing issues or the transport layer for connection problems. You might not have control over all layers, but understanding them can help you work within the constraints of the cloud provider's infrastructure (And also help you communicate better with their support teams). Take for example "Access control lists (ACLs)" that are often used in cloud environments to restrict traffic at different layers, such as network and transport layers:

- There is no route from VM1 to VM2 (Layer 3)
- Port 80 is blocked for communication with VM2 (Layer 4)

Other example can be "Security Groups" that are used to control inbound and outbound traffic at the instance level, affecting multiple layers of the OSI model (Sometimes they might even say they work at Layer 3 and 4, but they might also affect Layer 1 and 2 depending on the implementation).

#### Microservices Architecture

In microservices architectures, services often communicate over a network using APIs. Understanding connectivity at different layers can help ensure that services can communicate effectively. For example, if a microservice is unable to connect to another service, you might need to investigate the network layer for routing issues or the application layer for API compatibility problems. In this case, you might find that:

- The service discovery mechanism is not functioning properly (Layer 7)
- The API endpoints are not reachable due to network misconfigurations (Layer 3)

#### Internet of Things (IoT)

In IoT environments, devices often communicate over wireless networks. In this way Layer 1 connectivity is crucial. For example, if an IoT device is unable to connect to a central hub, you might need to investigate the physical layer for signal strength issues or the data link layer for addressing problems. In this case, you might find that:

- The device is out of range of the hub (Layer 1)
- The MAC address of the device is not recognized by the hub (Layer 2)

### Connectivity tutorial

Now, there's a pretty common use-case: Establishing connectivity between public and private (Or machines behind some kind of firewall). This is a pretty common scenario because you want to access resources that are not publicly available, such as databases, internal applications, or private APIs from public machines but keep those resources as private. There's lots of ways to achieve this:

Let's continue with our space mission analogy: Imagine you have a spacecraft (private resource) that needs to communicate with mission control (public machine). However, the spacecraft is in space, can't be publicly accessible and mission-control can't initiate communication with it. So, to establish connectivity:

- **Layer 1**: Is there physical connectivity? (Antennas, transmitters, etc). Let's assume yes. Check ✅
- **Layer 2**: Is the data link established? (Control to access physical connectivity). Again, assume yes. Check ✅
- **Layer 3**: Is there a route from mission control to the spacecraft? (Routing). Here we have a problem because the spacecraft is not publicly accessible. So we need to find a way to route the communication ❌/✅. As per the description probably there isn't any route for this, one way of solving this is by using a relay satellite (Bastion host, VPN, etc) that both mission control and the spacecraft can communicate with.
- **Layer 4**: Is the data sent actually delivered? (Ports, protocols, etc). Assuming we have a route now, we need to ensure that the correct ports and protocols are being used. As stated earlier, mission control can't initiate communication with the spacecraft, so what we can do is have the spacecraft initiate the communication instead ❌/✅. This way, the spacecraft can establish a connection to mission control through the relay satellite, allowing for two-way communication.
- **Layers 5, 6, 7**: Is the data meaningful? (Sessions, formatting, applications, etc). Finally, we need to ensure that the data being sent is properly formatted and understood by both parties. Assuming the previous layers are functioning correctly, we can focus on ensuring that the messages are correctly formatted and that both mission control and the spacecraft can interpret them. This is not relevant to our problem really because it was stated that machines can't communicate as they should so the **data** being sent is not meaningful (At least not right now).

I'm going to give four easy examples of how you would solve the identified problems at Layer 3 and Layer 4:

1. **Using a Bastion Host**: Set up a bastion host (relay satellite) that both the public machine (mission control) and the private resource (spacecraft) can communicate to. This allows the public machine to communicate with the private one using this intermediary.
2. **Using a VPN**: Establish a VPN connection between the public machine and the private network where the resource resides. By creating a secure tunnel, the public machine can access the private resource as if it were on the same local network (In other words, create a network for this two to communicate).
3. **Using SSH Tunneling**: If the private resource allows outbound SSH connections, you can set up an SSH tunnel from the public machine to the private resource through an intermediary server (relay satellite). This allows the public machine to forward traffic to the private resource securely.
4. **Using a Reverse Proxy**: Set up a reverse proxy server (relay satellite) that is publicly accessible and can forward requests to the private resource. The public machine communicates with the reverse proxy, which then forwards the requests to the private resource.

Enough talking, let's do some practical examples:

1. Bastion host example:

```bash
# From public machine (mission control)
ssh -J user@bastion_host user@private_resource
```

Here we are using the `-J` flag to specify the bastion host as a jump host to connect to the private resource.

2. VPN example:

Setting up a VPN can vary depending on the software used, but here's a basic example using OpenVPN:

```bash
## Server configuration server.conf (on bastion host)
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server
.key
dh dh2048.pem
server
## Client configuration client.conf (on public machine)
port 1194
proto udp
dev tun
remote bastion_host_ip
ca ca.crt
cert client.crt
key client.key
# On the VPN server (bastion host)
openvpn --config server.conf
# On the public machine (mission control)
openvpn --config client.conf
```

Here we are starting the OpenVPN server on the bastion host and connecting to it from the public machine. Once connected, the public machine can access the private resource as if it were on the same local network. Why? Because now both machines are part of the same virtual network created by the VPN. The private resource can also connect to the VPN server if needed.

3. SSH Tunneling example:


```bash
# From public machine (mission control)
ssh -L 8080:private_resource:80 user@bastion_host
```

Here we are forwarding local port `8080` on the public machine to port `80` on the private resource through the bastion host. So any data sent to `localhost:8080` on the public machine will be forwarded to the private resource. If we want the private resource to initiate the connection instead, we can use reverse tunneling:

```bash
# From private resource (spacecraft)
ssh -R 8080:localhost:80 user@bastion_host
```

Here we are forwarding port `80` on the private resource to port `8080` on the bastion host. So any data sent to `bastion_host:8080` will be forwarded to port `80` on the private resource. 

4. Reverse Proxy example:
Using Nginx as a reverse proxy:

```nginx
# Nginx configuration (on bastion host)
server {
    listen 80;
    server_name bastion_host;
    location / {
        proxy_pass http://private_resource_ip:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Here we are configuring Nginx to listen on port `80` and forward requests to the private resource. The public machine can then access the private resource by sending requests to the bastion host.

### Practical exercise

Now, I could end up this tutorial here, but I think it would be more fun if we actually try to implement one of these solutions. So here's a practical exercise we'll be doing together:

I want to set a Kubernetes cluster with two nodes:

- Node 1: Public node (Mission control)
- Node 2: Private node (Spacecraft)

The goal is to be able to schedule a pod on the private node that can be accessed from the public node using a Layer 4 proxy (Konnektivity). Now, _Why this not so common tool?_ Because it's easy to set up and use, it abstracts away a lot of the complexity involved in setting up connectivity between public and private nodes. Plus, it works really well with Kubernetes, which is what we're using for this exercise. _Why not a more traditional thing? Like a VPN_ Good question, I hope my answer satisfies you: Because when you set up a VPN, you're creating a secure tunnel between two networks, which can sometimes be an overkill and if not configured correctly, potentially insecure. With Konnektivity, we're able to establish connectivity at Layer 4 without the need for connecting different networks, making it simpler and more efficient for our needs.