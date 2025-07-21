import RoleRepository from "../database/repositories/roleRepository";
import UserRepository from "../database/repositories/userRepository";
import CompanyRepository from "../database/repositories/companyRepo";
import {
  ADMIN_EMAIL,
  ADMIN_USER,
  ADMIN_PASS,
  AWS_BUCKET,
} from "../config/config";
import {
  IUserCreate,
  IUserCreateReturn,
  IUserLogin,
  IUserSignin,
} from "../interfaces/userInterface";
import { createToken, hashPassword, isMatch } from "../helpers/encrypt";
import { Response, Request } from "express";
import mongoose from "mongoose";
import s3 from "../config/aws_config";
import fs from "fs";

class UserService {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private companyRepo: CompanyRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
    this.companyRepo = new CompanyRepository();
  }
  public async createAdmin(): Promise<void> {
    try {
      const role = await this.roleRepository.getIdByRole("ADMIN");
      if (role) {
        const hashedPassword = await hashPassword(ADMIN_PASS);
        const needAdmin = await this.userRepository.getUserByRole(role._id);
        if (!needAdmin) {
          const user = {
            name: ADMIN_USER,
            password: hashedPassword,
            email: ADMIN_EMAIL,
            role: role._id,
          };
          const newUser = await this.userRepository.createUser(user);
          console.log(`Admin is Created with name ${newUser?.name}`);
        } else {
          console.log(`Admin already exists`);
        }
      } else {
        console.log(`Admin creation failed`);
      }
    } catch (error: any) {
      throw new Error(`Error in Admin creation`);
    }
  }
  public async login(req: Request, res: Response) {
    try {
      const user: IUserLogin = req.body;
      const userDetails: any | null = await this.userRepository.getUserByName(
        user.name,
      );

      if (!userDetails) {
        return res.sendError(null, "User Not found", 400);
      } else {
        const matchPassword = await isMatch(
          user.password,
          userDetails.password,
        );
        if (!matchPassword) {
          return res.sendError(null, "Wrong password", 400);
        }
        const accessToken = createToken({
          _id: userDetails._id,
          role: userDetails.role.name,
          name: userDetails.name,
          email: userDetails.email,
        });
        let userResponse: any = {
          name: userDetails.name,
          email: userDetails.email,
          isBlocked: userDetails.isBlocked,
          role: userDetails.role.name,
          token: accessToken,
          permissions: userDetails.role.permissions,
        };
        if (userDetails?.resume_link) {
          userResponse.resume = userDetails?.resume_link;
        }
        if (userDetails?.company) {
          userResponse.company = userDetails?.company;
        }
        return res.sendFormatted(userResponse, "User Details", 200);
      }
    } catch (e) {
      throw new Error(`Error in Login`);
    }
  }
  public async updateUser(req: Request, res: Response) {
    try {
      const { id }: any = req.params;
      const existingUser = await this.userRepository.getUserById(id);

      if (!existingUser) {
        return res.sendError(
          "User not found",
          "Error while updating user",
          404,
        );
      }

      const user: any = req.body;
      let updateObject: any = {};

      if (user.name) {
        updateObject.name = user.name;
      }

      if (user.password) {
        const hashedPassword = await hashPassword(user.password);
        updateObject.password = hashedPassword;
      }

      if (user.email) {
        updateObject.email = user.email;
      }

      if (user.role) {
        updateObject.role = user.role;
      }

      if (user.dob) {
        updateObject.dob = user.dob;
      }
      if (user.phoneno) {
        updateObject.phoneno = user.phoneno;
      }
      if (user.skills) {
        updateObject.skills = user.skills;
      }
      const success = await this.userRepository.updateUser(id, updateObject);

      if (!success) {
        return res.sendError("Update failed", "Unable to update user", 500);
      }

      return res.sendFormatted(
        "User updated successfully",
        "User Updated",
        200,
      );
    } catch (error: any) {
      return res.sendError("Internal server error", error.message, 500);
    }
  }
  public async updateResume(req: Request, res: Response) {
    try {
      if (!req.files) {
        return res.sendError(
          "Error while updating resume",
          "Resume updation failed",
          400,
        );
      }

      if (!req.user) {
        return res.sendError("Error not logged in", "Login required", 400);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const resume = files?.resume?.[0];
      const { _id, ...other }: any = req.user;
      const fileBuffer = fs.readFileSync(resume.path);
      const params: any = {
        Bucket: AWS_BUCKET,
        Key: `resumes/${Date.now()}-${resume.originalname}`,
        Body: fileBuffer,
        ContentType: resume.mimetype,
      };
      console.log(params, "params");
      const uploadResult: string = await s3
        .upload(params)
        .promise()
        .then((res) => {
          return res.Location;
        })
        .catch((error) => {
          console.error("❌ Error uploading file to S3:", error);
          throw new Error("S3 upload failed");
        });
      fs.unlinkSync(resume.path);
      const user = {
        resume_link: uploadResult,
      };
      console.log(user, "user");
      const updateUser = await this.userRepository.updateUser(_id, user);
      return res.sendFormatted(updateUser, "User updated", 200);
    } catch (error: any) {
      return res.sendError(
        `Error while updating resume`,
        "Error while updating resume",
        400,
      );
    }
  }

  public async updateUserMine(req: Request, res: Response) {
    try {
      const { _id }: any = req.user;
      const existingUser = await this.userRepository.getUserById(_id);
      if (!existingUser) {
        return res.sendError(
          "User not found",
          "Error while updating user",
          404,
        );
      }
      console.log(req.body, "body");
      const user: any = req.body;
      let updateObject: any = {};

      if (user.name) {
        updateObject.name = user.name;
      }

      if (user.password) {
        const hashedPassword = await hashPassword(user.password);
        updateObject.password = hashedPassword;
      }

      if (user.email) {
        updateObject.email = user.email;
      }

      if (user.role) {
        updateObject.role = user.role;
      }

      if (user.dob) {
        updateObject.dob = user.dob;
      }
      if (user.phoneno) {
        updateObject.phoneno = user.phoneno;
      }
      if (user.skills) {
        updateObject.skills = user.skills;
      }
      const success = await this.userRepository.updateUser(_id, updateObject);

      if (!success) {
        return res.sendError("Update failed", "Unable to update user", 500);
      }

      return res.sendFormatted(
        "User updated successfully",
        "User Updated",
        200,
      );
    } catch (error: any) {
      return res.sendError("Internal server error", error.message, 500);
    }
  }
  public async signUpUser(req: Request, res: Response) {
    try {
      const user: IUserSignin = req.body;

      const existingUserByEmail = await this.userRepository.getUserByEmail(
        user.email,
      );
      if (existingUserByEmail) {
        return res.sendError(null, "User with this email already exists", 400);
      }

      const hashedPassword = await hashPassword(user.password);

      const userObj = {
        name: user.name,
        password: hashedPassword,
        email: user.email,
        role: user.role,
      };

      const newUser: any =
        await this.userRepository.createUserWithToken(userObj);

      if (!newUser) return res.sendError(null, "User Not created", 400);

      const accessToken = createToken({
        _id: newUser._id,
        role: newUser.role.name,
        name: newUser.name,
        email: newUser.email,
      });
      const userResponse = {
        name: newUser.name,
        email: newUser.email,
        isBlocked: newUser.isBlocked,
        role: newUser.role.name,
        token: accessToken,
      };
      return res.sendFormatted({ user: userResponse }, "User Created", 200);
    } catch (error) {
      console.error("Signup Error:", error);
      return res.sendError(error, "Error creating user", 500);
    }
  }

  public async createUser(req: Request, res: Response) {
    try {
      const user: IUserCreate = req.body;
      const userDetails: IUserCreateReturn | null =
        await this.userRepository.getUserByName(user.name);
      const userEmail: IUserCreateReturn | null =
        await this.userRepository.getUserByEmail(user.email);
      if (!userDetails && userEmail == null) {
        const hashedPassword = await hashPassword(user.password);
        const userObj: IUserCreate = {
          _id: user._id,
          name: user.name,
          password: hashedPassword,
          email: user.email,
          role: user.role,
        };
        const newUser = await this.userRepository.createUser(userObj);
        return res.sendFormatted(newUser, "User Created", 200);
      } else {
        return res.sendError(null, "User Already exists", 400);
      }
    } catch (error) {
      throw new Error(`Error creating user`);
    }
  }
  public async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(null, "User not found", 400);
      }
      const userId = req.user._id;
      const user = await this.userRepository.getUserById(userId);
      return res.sendFormatted(user, "User Details", 200);
    } catch (error) {
      throw new Error(`Error getting user ${error}`);
    }
  }
  public async updateIsBlocked(req: Request, res: Response) {
    try {
      const userId: any = req.params.id;
      const userUpdated = await this.userRepository.updateUserIsBlocked(userId);
      return res.sendFormatted(userUpdated, "User Status updated", 200);
    } catch (error) {
      return res.sendError(error, "Error while getting users", 400);
    }
  }
  public async getAllUsers(req: Request, res: Response) {
    try {
      const pageParam = req.query.page as string | undefined;
      const offsetParam = req.query.offset as string | undefined;
      const page = pageParam ? parseInt(pageParam) : undefined;
      const offset = offsetParam ? parseInt(offsetParam) : undefined;
      let users;
      if (page && offset) {
        const skip = (page - 1) * offset;
        users = await this.userRepository.getAllUsersPaginated(skip, offset);
      } else {
        users = await this.userRepository.getAllUser();
      }
      return res.sendArrayFormatted(users, "Fetched All Users", 200);
    } catch (error) {
      return res.sendError(error, "Error while getting users", 400);
    }
  }
  public async addLanguage(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(`User needs to login`, `User not logged in`, 400);
      }
      const userId: any = new mongoose.Types.ObjectId(req.user._id.toString());
      console.log(userId);
      const { data }: any = req.body;
      const updateUser = await this.userRepository.createLanguage(userId, data);
      return res.sendFormatted(updateUser, "User with language not there", 200);
    } catch (error) {
      return res.sendError(
        `Error while adding lang`,
        "Error while adding lang",
        400,
      );
    }
  }
  public async addEducation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(`User needs to login`, `User not logged in`, 400);
      }
      const userId: any = new mongoose.Types.ObjectId(req.user._id.toString());
      const { data }: any = req.body;
      console.log(data, userId, "data");
      const updateUser = await this.userRepository.createEducationObject(
        userId,
        data,
      );
      return res.sendFormatted(
        updateUser,
        "User with Education not there",
        200,
      );
    } catch (error) {
      return res.sendError(
        `Error while adding education`,
        "Error while adding education",
        400,
      );
    }
  }
  public async deleteById(req: Request, res: Response) {
    try {
      const { id }: any = req.params;
      const user = await this.userRepository.deleteUser(id);
      res.sendFormatted(user, "User Deleted", 204);
    } catch (error) {
      throw new Error(`Error while deleting user`);
    }
  }

  public async addExperince(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(`User needs to login`, `User not logged in`, 400);
      }
      const userId: any = new mongoose.Types.ObjectId(req.user._id.toString());
      const { data }: any = req.body;
      const updateUser = await this.userRepository.createExperinceObject(
        userId,
        data,
      );
      return res.sendFormatted(
        updateUser,
        "User with Experience not there",
        200,
      );
    } catch (error) {
      return res.sendError(
        `Error while adding experience`,
        "Error while adding experience",
        400,
      );
    }
  }

  public async addCompany(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(`User not logged in`, "User Not logged in", 400);
      }
      const { _id, ...other }: any = req.user;
      const { data } = req.body;
      if (data.logo) {
        if (!req.files) {
          return res.sendError(
            "Error while updating resume",
            "Resume updation failed",
            400,
          );
        }
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        const logo = files?.images?.[0];
        const fileBuffer = fs.readFileSync(logo.path);
      }
      const createCompany = await this.companyRepo.createCompany(_id, data);
      return res.sendFormatted(createCompany, "Company Added", 200);
    } catch (error) {
      return res.sendError(
        `Error while adding Company`,
        `Error while adding comapny`,
        400,
      );
    }
  }

  public async getCompanies(req: Request, res: Response) {
    try {
      const { search }: any = req.query;
      let companies = [];
      if (search != "") {
        companies = await this.companyRepo.getCompaniesByPrefix(search);
      } else {
        companies = await this.companyRepo.getCompaniesByPrefix();
      }
      return res.sendArrayFormatted(companies, "Comapnies Fetched", 200);
    } catch (error) {
      return res.sendError(
        `Error while getting companies`,
        "Error while getting comapnies",
        400,
      );
    }
  }

  public async updateProfileImage(req: Request, res: Response) {
    try {
      if (!req.files) {
        return res.sendError(
          "Error while updating profile Image",
          "Profile Images updation failed",
          400,
        );
      }

      if (!req.user) {
        return res.sendError("Error not logged in", "Login required", 400);
      }
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      console.log(files, "files");
      const resume = files?.images?.[0];
      console.log(resume);
      const { _id, ...other }: any = req.user;
      const fileBuffer = fs.readFileSync(resume.path);
      const params: any = {
        Bucket: AWS_BUCKET,
        Key: `images/${Date.now()}-${resume.originalname}`,
        Body: fileBuffer,
        ContentType: resume.mimetype,
      };

      const uploadResult: string = await s3
        .upload(params)
        .promise()
        .then((res) => {
          return res.Location;
        })
        .catch((error) => {
          console.error("❌ Error uploading file to S3:", error);
          throw new Error("S3 upload failed");
        });
      fs.unlinkSync(resume.path);
      const user = {
        profile_image: uploadResult,
      };
      const updateUser = await this.userRepository.updateUser(_id, user);
      return res.sendFormatted(updateUser, "User updated", 200);
    } catch (error) {
      return res.sendError(
        `Error while updating profile image`,
        "Profile image updated",
        400,
      );
    }
  }
}

export default UserService;
