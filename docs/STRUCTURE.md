## Structure

### Doc List

- [README](../README.md)
- [Test](TEST.md)

---

- `docs/`
  - `index.md`
  - `about.md`
  - `contact.md`

### File Structure

```
src
├── stores/
│   ├── moduleA/
│   │   └── globalAStore.ts      <- high level (fully global)
│   ├── moduleB/
│   │   ├── globalBStore.ts
│   │   └── globalBStoreHelpers.ts
│   └── utils/
│       └── utility files
├── components/
│   └── feature/
│       └── featureStore/
│           ├── featureStore.ts   <-- mid-low level (feature specific)
│           └── featureHelpers.ts
└── etc.
```
