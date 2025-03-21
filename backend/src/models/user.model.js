import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // This creates 'createdAt' and 'updatedAt' automatically
);

// Virtual to format the createdAt field into "21 March 2025"
userSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt
    ? this.createdAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;
});

// Ensure virtuals are included in the output when converting to JSON
userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

export default User;
