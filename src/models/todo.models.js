import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    coverImage: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Todo = model("Todo", todoSchema);

export { Todo };
