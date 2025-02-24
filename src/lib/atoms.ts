import { atom } from "jotai";
import { type Task as PrismaTask } from "@prisma/client";

export const exampleTasksAtom = atom([
  {
    id: 1,
    key: "1",
    description: "Sign in to create and save your own tasks",
    isOptimistic: false,
  },
  {
    id: 2,
    key: "2",
    description: "Car insurance",
    isOptimistic: false,
  },
  {
    id: 3,
    key: "3",
    description: "Invite Sarah for dinner",
    isOptimistic: false,
  },
  {
    id: 4,
    key: "4",
    description: "Email documents to John",
    isOptimistic: false,
  },
  {
    id: 5,
    key: "5",
    description: "Read book",
    isOptimistic: false,
  },
  {
    id: 6,
    key: "6",
    description: "Create exercise routine",
    isOptimistic: false,
  },
]);

type Task = PrismaTask & { isOptimistic?: boolean };

export const tasksAtom = atom<Task[]>([]);
