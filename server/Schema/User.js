// UserSchema.js
import mongoose, { Schema } from "mongoose";

const profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

const profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: [true, "Fullname is required"],
        minlength: [3, "Fullname must be at least 3 characters long"],
        maxlength: [20, "Fullname must not exceed 20 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        validate: {
          validator: function (email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
          },
          message: "Please enter a valid email address",
        },
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username must be at least 3 characters long"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not exceed 200 characters"],
        default: "",
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`;
        },
      },
    },
    social_links: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    account_info: {
      total_posts: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
    },
    google_auth: { type: Boolean, default: false },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: { createdAt: "joinedAt" },
  }
);

// Add indexes with partial filter expressions
userSchema.index(
  { "personal_info.email": 1 },
  {
    unique: true,
    partialFilterExpression: { "personal_info.email": { $type: "string" } },
  }
);

userSchema.index(
  { "personal_info.username": 1 },
  {
    unique: true,
    partialFilterExpression: { "personal_info.username": { $type: "string" } },
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("personal_info.email")) {
      const existingUser = await this.constructor.findOne({
        "personal_info.email": this.personal_info.email,
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }
    }

    if (this.isModified("personal_info.username")) {
      const existingUser = await this.constructor.findOne({
        "personal_info.username": this.personal_info.username,
      });

      if (existingUser) {
        throw new Error("Username already exists");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("users", userSchema);
