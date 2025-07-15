import {Account, AppwriteException, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.syed.foodordering",
    databaseId: '6874df780000d772c078',
    bucketId:'6875ee70000cc1802cae',
    userCollectionId: '6874df94000ebd57d3af',
    categoriesCollectionId: '6875ea7900239a3ec12f',
    menuCollectionId: '6876297d003c1e1c1ac9',
    customizationsCollectionId: '68762ac9003b41eea0e1',
    menuCustomizationsCollectionId: '68762bb8002c337e5e15'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        if (e instanceof AppwriteException) {
            throw new Error(e.message);
        }
        throw e;

    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("Account not found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser || currentUser.total === 0) {
            throw new Error("User document not found");
        }

        return currentUser.documents[0];
    } catch (e) {
        console.log("getCurrentUser error", e);
        if (e instanceof AppwriteException) {
            throw new Error(e.message);
        }
        throw e;
    }
}
