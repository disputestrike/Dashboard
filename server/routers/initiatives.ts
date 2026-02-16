import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getInitiativesByGoal,
  getAllInitiatives,
  createInitiative,
  updateInitiative,
  deleteInitiative,
  getSubBoxesByInitiative,
  createSubBox,
  updateSubBox,
  deleteSubBox,
} from "../db";
import { v4 as uuidv4 } from "uuid";

const GoalEnum = z.enum(["A", "B", "C", "D"]);
const StatusEnum = z.enum(["Not Started", "In Progress", "Complete", "At Risk"]);

export const initiativesRouter = router({
  // Get all initiatives
  getAll: protectedProcedure.query(async () => {
    return await getAllInitiatives();
  }),

  // Get initiatives by goal
  getByGoal: protectedProcedure
    .input(z.object({ goal: GoalEnum }))
    .query(async ({ input }) => {
      return await getInitiativesByGoal(input.goal);
    }),

  // Create initiative
  create: protectedProcedure
    .input(
      z.object({
        goal: GoalEnum,
        title: z.string().min(1),
        description: z.string().optional(),
        owner: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const initiativeId = `init-${uuidv4()}`;
      return await createInitiative({
        initiativeId,
        goal: input.goal,
        title: input.title,
        description: input.description,
        owner: input.owner,
        status: "Not Started",
      });
    }),

  // Update initiative
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        owner: z.string().optional(),
        status: StatusEnum.optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await updateInitiative(id, data);
    }),

  // Delete initiative
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Delete all sub-boxes first
      const subBoxes = await getSubBoxesByInitiative(input.id);
      for (const subBox of subBoxes) {
        await deleteSubBox(subBox.id);
      }
      return await deleteInitiative(input.id);
    }),

  // Get sub-boxes for an initiative
  getSubBoxes: protectedProcedure
    .input(z.object({ initiativeId: z.number() }))
    .query(async ({ input }) => {
      return await getSubBoxesByInitiative(input.initiativeId);
    }),

  // Create sub-box
  createSubBox: protectedProcedure
    .input(
      z.object({
        initiativeId: z.number(),
        title: z.string().min(1),
        status: StatusEnum.optional(),
        owner: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const subBoxId = `subbox-${uuidv4()}`;
      return await createSubBox({
        subBoxId,
        initiativeId: input.initiativeId,
        title: input.title,
        status: input.status || "Not Started",
        owner: input.owner,
      });
    }),

  // Update sub-box
  updateSubBox: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        status: StatusEnum.optional(),
        notes: z.string().optional(),
        documentUrl: z.string().optional(),
        documentName: z.string().optional(),
        owner: z.string().optional(),
        dueDate: z.date().optional(),
        completedDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await updateSubBox(id, data);
    }),

  // Delete sub-box
  deleteSubBox: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteSubBox(input.id);
    }),
});
