# Synvert Playground

## Development

```
npm start
```

## Deployment

```
docker build -t xinminlabs/synvert-playground:$(git rev-parse --short HEAD) .
docker push xinminlabs/synvert-playground:$(git rev-parse --short HEAD)
```