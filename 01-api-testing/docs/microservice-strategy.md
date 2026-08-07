# Definitions

### What Is a Microservice?

- A microservice architecture builds software as suites of collaborating services.
- Single Responsibility Principle at architectural level.
- Benefits:
    - Independent deployability
    - Language/Platform/Technology independence for different components
    - Distinct axes of scalability
    - Increased architectural flexibility
- As small as possible, but as big as necessary.
- Often integrated using REST over HTTP.
- Each microservice may or may not provide some form of user interface.

### Anatomy

Microservices can usually be split into similar kinds of modules:
- Protocol:
    - **Resources**: mappers between the application protocol exposed by the service and messages to objects representing the domain.
- Domain:
    - **Service Layer**: coordinate across multiple domain activities.
    - **Domain**: almost all of the service logic (domain model).
    - **Repositories**: act on collections of domain entities (often persistence backed).
- External:
    - **Gateways**: message passing with a remote service.
    - **HTTP Client**: handle request-response cycle.
- Persistence:
    - **Data Mappers / ORM**: persisted objects between requests.

### Architecture

- Typically, a team will act as guardians to one or more microservices.
- Interchange format: JSON (sometimes XML).
- The Atom syndication format is becoming increasingly popular as a lightweight means of implementing pub-sub between microservices.
- Techniques such as timeouts, circuit breakers and bulkheads can help to maintain overall system uptime in spite of a component outage.

# Testing Strategies

### Unit

- A unit test exercises the smallest piece of testable software in the application to determine whether it behaves as expected.
- Difficulty in writing a unit test can highlight when a module should be broken down into independent more coherent pieces.
- Distinction:
    - **Sociable** unit testing (Domain) focusses on testing the behaviour of modules by observing changes in their state. This treats the unit under test as a black box tested entirely through its interface. 
    - **Solitary** unit testing (Resources/Service Layer/Gateways/Repositories) looks at the interactions and collaborations between an object and its dependencies, which are replaced by test doubles.

### Integration

- An integration test verifies the communication paths and interactions between components to detect interface defects.
- In microservice architectures they are typically used to verify interactions between layers of integration code and the external components to which they are integrating.
- Distinction:
    - **Gateway** integration tests allow any protocol level errors such as missing HTTP headers, incorrect SSL handling or request/response body mismatches to be flushed out at the finest testing granularity possible.
    - **Persistence** integration tests provide assurances that the schema assumed by the code matches that available in the data store.
- It may also make sense to separate integration tests in the CI build pipeline so that external outages don't block development.

### Component

- A component test limits the scope of the exercised software to a portion of the system under test, manipulating the system through internal code interfaces and using test doubles to isolate the code under test from other components.
- In a microservice architecture, the components are the services themselves.

### Contract

- An integration contract test is a test at the boundary of an external service verifying that it meets the contract expected by a consuming service.
- In contrast to integration tests, the services are not required to run at test time.

### End-to-end

- An end-to-end test verifies that a system meets external requirements and achieves its goals, testing the entire system, from end to end.
- The system is treated as a black box and the tests exercise as much of the fully deployed system as possible, manipulating it through public interfaces such as GUIs and service APIs.
- Guidelines:
    - Write as few end-to-end tests as possible. Add a time budget, an amount of time the team is happy to wait for the test suite to run.
    - Focus on personas and user journeys (Tools, such as Gauge and Concordion).
    - Choose your ends wisely.
    - Rely on infrastructure-as-code for repeatability (Docker/Kubernetes).
    - Make tests data-independent. Each test should set up (and ideally tear down) its own data as part of the test itself.

# Conclusions

### Test Pyramid

- The test pyramid helps us to maintain a balance between
the different types of test.
- In general, the more coarse grained a test is, the more brittle, time consuming to execute and difficult to write and maintain it becomes.
- The concept of the test pyramid is a simple way to think about the relative number of tests that should be written at each granularity. Moving up through the tiers of the pyramid, the scope of the tests increases and the number of tests that should be written decreases.
- At the top of the pyramid sits exploratory testing, manually exploring the system in ways that haven't been considered as part of the scripted tests.

### Summary

- **Unit tests**: exercise the smallest pieces of testable software in the application to determine whether they behave as expected.
- **Integration tests**: verify the communication paths and interactions between components to detect interface defects.
- **Component tests**: limit the scope of the exercised software to a portion of the system under test, manipulating the system through internal code interfaces and using test doubles to isolate the code under test from other components.
- **Contract tests**: verify interactions at the boundary of an external service asserting that it meets the contract expected by a consuming service.
- **End-to-end tests**: verify that a system meets external requirements and achieves its goals, testing the entire system, from end to end.