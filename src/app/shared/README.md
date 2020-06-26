# ShareModule

**Shall** include definitions:

- Apply common custom business components

**Should** export all included modules.

**Should not** have `providers` attribute.

## Custom global components or directives

Each component or instruction should have a complete description file, **suggestion** a reasonable directory structure should be:

```
├── components
│ ├── comp1
│ │ ├── index.ts
│ │ ├── README.md
│ ├── comp2
│ │ ├── index.ts
│ │ ├── README.md
├── directives
│ ├── dire1
│ │ ├── index.ts
│ │ ├── README.md
│ ├── dire2
│ │ ├── index.ts
│ │ ├── README.md
```
