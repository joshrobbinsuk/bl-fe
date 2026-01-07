export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION!,
    },
  },
}
