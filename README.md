# Comfy Playground

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), showcasing integration with the Comfy API.

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Usage

This project demonstrates the usage of the Comfy API in `src/app/page.tsx`. Here's an overview of how the API is utilized:

1. **Initializing the CD Client**:
   The CD client is initialized in `src/app/hooks/hooks.tsx`
   We are doing a server side proxy, so we can have the full sdk on client side while maintaining auth on this project

   ```typescript
   import { ComfyDeploy } from "comfydeploy";

   export const cd = new ComfyDeploy({
    bearer: process.env.COMFY_API_KEY
   });
   ```

2. **Fetching Deployments**:
   The `useComfyQuery` hook is used to fetch deployments:

   ```typescript
   const deploymenets = cd.deployments.list({
    environment: "production"
   })

    // or

   const { data: deployments } = useComfyQuery("deployments", "list", [
     { environment: "production" },
   ]);
   ```

3. **Running a Deployment**:
   The `cd.run.stream` method is used to execute a deployment wiht streaming:

   ```typescript
   const stream = await cd.run.stream({
     deploymentId: selectedDeployment.id,
     inputs: inputValues,
   });
   ```

4. **Handling Stream Updates**:
   The stream is processed to update logs and outputs:

   ```typescript
   for await (const chunk of stream) {
     if (chunk.event === "log_update") {
       setLog((prevLog) => [...prevLog, chunk.data.logs]);
     } else if (chunk.event === "event_update") {
       if (chunk.data.event === "executed") {
         addOutput(chunk.data.data);
       }
     }
   }
   ```

## Key Components

- `InputForm`: Handles user inputs for the selected deployment.
- `OutputDisplay`: Shows the results of the executed deployment.
- `ScrollableContent`: Displays logs from the deployment execution.

## Learn More

To learn more about Next.js and the Comfy API, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Comfy API Documentation](https://docs.comfydeploy.com/introduction)
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
