import {userService} from '../services/userService.js';
import {accountService} from '../services/accountService.js';

const initialAccountData = [
    { accountNr: null, login: "user1", firstname: "Bob", lastname: "Müller", password: "1234" },
    { accountNr: null, login: "user2", firstname: "Lisa", lastname: "Meier", password: "1234" },
    { accountNr: null, login: "user3", firstname: "Kevin", lastname: "Schmidt", password: "1234" }
];

const categories = [ 'living', 'food', 'furniture', 'mobility', 'beauty_health', 'media', 'electronics' ];
const startDate = +new Date(Date.now() - (2000 /*d*/ * 24 /*h*/ * 60 /*min*/ * 60 /*s*/ * 1000));

const maxRandomTransactionAmount = 50; // $
const maxTransactions = 1500;

function getRandomAccountId() {
    const maxIdx = initialAccountData.length - 1;
    const randomIdx = Math.round(Math.random() * maxIdx);

    return initialAccountData[randomIdx].accountNr;
}

function getRandomCategory() {
    return categories[Math.round(Math.random() * categories.length)];
}

async function createTransaction() {
    let currentTransaction = 0;

    async function createTransactionRecursive() {
        await accountService.addTransaction(
            getRandomAccountId(),
            getRandomAccountId(),
            Math.round(Math.random() * maxRandomTransactionAmount),
            new Date(startDate + (3600 * currentTransaction * 1000 * 3)),
            getRandomCategory());

        if (++currentTransaction < maxTransactions) {
            await createTransactionRecursive();
        }
    }
    await createTransactionRecursive();
}

export const dataSeed = {
    async insertSeedData() {
        try {
            if (!await userService.tryGetByLogin(initialAccountData[0].login)) {
                for (let initialData of initialAccountData) {
                    try {
                        const account = await userService.register(
                            initialData.login,
                            initialData.firstname,
                            initialData.lastname,
                            initialData.password,
                            startDate);

                        initialData.accountNr = account.accountNr;
                    } catch (error) {
                        console.error(`Failed to register user ${initialData.login}:`, error);
                        throw error;
                    }
                }
                try {
                    await createTransaction();
                } catch (error) {
                    console.error('Failed to create transactions:', error);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Failed to insert seed data:', error);
            throw error;
        }
    }
};
