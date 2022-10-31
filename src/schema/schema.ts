import { buildSchema } from 'graphql';
import { queryBook } from 'nodejs-book-modules/lib/schema/query';
import { mutationBook } from 'nodejs-book-modules/lib/schema/mutation';
import { typeBook } from 'nodejs-book-modules/lib/schema/type';

export const schema = buildSchema(`
    type Query {
        ${queryBook}
    }
    type Mutation {
        ${mutationBook}
    }
    ${typeBook}
`);
