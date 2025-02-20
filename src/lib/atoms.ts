import { atom } from "jotai";
import { type Task as PrismaTask } from "@prisma/client";

export const exampleTasksAtom = atom([
  { id: 1, description: "Car insurance", isOptimistic: false },
  { id: 2, description: "Invite Sarah for dinner", isOptimistic: false },
  { id: 3, description: "Email documents to John", isOptimistic: false },
  { id: 4, description: "Read book", isOptimistic: false },
  { id: 5, description: "Create exercise routine", isOptimistic: false },
  { id: 6, description: "Finish project", isOptimistic: false },
]);

type Task = PrismaTask & { isOptimistic?: boolean };

export const tasksAtom = atom<Task[]>([]);
