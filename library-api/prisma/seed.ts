import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to seed the database.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  console.log('Seeding database...');

  const genreNames = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy'];
  const genres = new Map<string, number>();

  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    genres.set(name, genre.id);
  }

  const booksData = [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
    { title: '1984', author: 'George Orwell', genre: 'Fiction' },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
    },
    { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Fiction' },
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      genre: 'Non-Fiction',
    },
    { title: 'Educated', author: 'Tara Westover', genre: 'Non-Fiction' },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Non-Fiction' },
    { title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction' },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction' },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      genre: 'Science Fiction',
    },
    {
      title: 'The Left Hand of Darkness',
      author: 'Ursula K. Le Guin',
      genre: 'Science Fiction',
    },
    { title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      genre: 'Fantasy',
    },
    {
      title: 'A Game of Thrones',
      author: 'George R.R. Martin',
      genre: 'Fantasy',
    },
    {
      title: 'The Way of Kings',
      author: 'Brandon Sanderson',
      genre: 'Fantasy',
    },
  ];

  for (const { title, author, genre } of booksData) {
    const genreId = genres.get(genre);

    if (genreId === undefined) {
      throw new Error(`No genre ID found for "${genre}".`);
    }

    const existingBook = await prisma.book.findFirst({
      where: { title, author },
      select: { id: true },
    });

    if (existingBook) {
      await prisma.book.update({
        where: { id: existingBook.id },
        data: { genreId },
      });
    } else {
      await prisma.book.create({
        data: { title, author, genreId },
      });
    }
  }

  console.log(
    `Successfully seeded ${booksData.length} books across ${genreNames.length} genres.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error('Error while seeding database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
