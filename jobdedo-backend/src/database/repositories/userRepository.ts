import mongoose, { ObjectId } from "mongoose";
import { IUserCreate, IUserCreation } from "../../interfaces/userInterface";
import User from "../models/userModel";
import Language from "../models/languangesModel";
import Education from "../models/educationModel";
import Experince from "../models/experinceModel";
import CompanyRepo from "./companyRepo";

class UserRepository {
  private companyRepo: CompanyRepo;
  constructor() {
    this.companyRepo = new CompanyRepo();
  }
  public async createUser(user: IUserCreation): Promise<IUserCreation | null> {
    try {
      const newUser = await User.create(user);
      return newUser.toObject();
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async createUserWithToken(user: IUserCreation): Promise<any | null> {
    try {
      const newUser = await User.create(user);
      const populatedUser = await newUser.populate("role");
      return populatedUser.toObject();
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async getUserByRole(
    role: mongoose.Schema.Types.ObjectId,
  ): Promise<boolean> {
    try {
      const user = await User.findOne({ role });
      return user ? true : false;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async getUserByEmail(email: string): Promise<any | null> {
    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error: any) {
      throw new Error("No user found");
    }
  }
  public async getUserByName(name: string): Promise<any | null> {
    try {
      const user = await User.findOne({ name })
        .populate({
          path: "role",
          populate: {
            path: "permissions",
            model: "permission",
          },
        })
        .lean();
      return user;
    } catch (error: any) {
      throw new Error("No user found");
    }
  }
  public async getUserById(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<any | null> {
    try {
      const user = await User.findById(id).populate([
        {
          path: "role",
          populate: {
            path: "permissions",
            model: "permission",
          },
        },
        { path: "education" },
        { path: "language" },
        { path: "experinces" },
        { path: "company" },
      ]);

      if (!user) {
        return null;
      }

      return user.toObject();
    } catch (e) {
      throw new Error("User Not Found");
    }
  }

  public async getAllUsersPaginated(skip: number, limit: number) {
    try {
      const countUser = await User.countDocuments();
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .populate("role")
        .lean();
      return { users, count: countUser };
    } catch (error) {
      throw new Error("User Not Found");
    }
  }
  public async getAllUser() {
    try {
      const users = await User.find().populate("role").lean();
      return { users, count: users.length };
    } catch (error) {
      throw new Error("User Not Found");
    }
  }
  public async deleteUser(id: ObjectId) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Delete User Failed`);
    }
  }
  public async updateUser(id: any, userObject: any): Promise<any | null> {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      if (user.company && Object.keys(userObject).includes("company")) {
        await this.companyRepo.pushEmployee(
          id,
          userObject.company,
          user.company,
        );
      }
      if (!user.company && Object.keys(userObject).includes("company")) {
        await this.companyRepo.pushEmployee(id, userObject.company);
      }
      user.set(userObject);
      await user.save();
      return user ?? null;
    } catch (error) {
      throw new Error(`Error while updating the user`);
    }
  }
  public async updateUserIsBlocked(id: ObjectId): Promise<any | null> {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new Error("User not found");
      }
      user.isBlocked = !user.isBlocked;
      await user.save();
      return user;
    } catch (e: any) {
      throw new Error(`Error updating isBlocked status: ${e.message}`);
    }
  }

  public async createLanguage(userId: string, langBody: any) {
    try {
      const createLang = await Language.create(langBody);
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: { language: createLang._id },
        },
        { new: true },
      );

      return updateUser;
    } catch (error: any) {
      throw new Error(`Error while adding language: ${error.message || error}`);
    }
  }

  public async createEducationObject(userId: string, educationBody: any) {
    try {
      const createEducation = await Education.create(educationBody);
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            education: createEducation._id,
          },
        },
        { new: true },
      );
      return updateUser;
    } catch (error: any) {
      throw new Error(`Error while getting creating education ${error}`);
    }
  }

  public async createExperinceObject(userId: string, expBody: any) {
    try {
      const createExperince = await Experince.create(expBody);
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            experinces: createExperince._id,
          },
        },
        { new: true },
      );
      return updateUser;
    } catch (error: any) {
      throw new Error(`Error while getting creating education ${error}`);
    }
  }

  public async getUsersWithResume() {
    try {
      const users = await User.find({
        resume_link: { $ne: null },
      });
      return users;
    } catch (error: any) {
      throw new Error(`Error while getting users`);
    }
  }
}
export default UserRepository;
