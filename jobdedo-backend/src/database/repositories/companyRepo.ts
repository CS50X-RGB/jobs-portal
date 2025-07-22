import Company from "../models/companyModel";
import User from "../models/userModel";

class CompanyRepo {
  constructor() {}
  public async getCompaniesByPrefix(prefix?: string) {
    try {
      let filter: any = {};
      if (prefix) {
        filter = {
          name: { $regex: `^${prefix}`, $options: "i" },
        };
      }
      const companies = await Company.find(filter).populate("users");

      return companies;
    } catch (error: any) {
      throw new Error(
        `Error while searching companies by prefix: ${error.message}`,
      );
    }
  }

  public async createCompany(userId: any, companyData: any) {
    try {
      const companyObj = await Company.create(companyData);
      const oldUser: any = await User.findById(userId);
      if (oldUser.company) {
        await Company.findByIdAndUpdate(oldUser.company, {
          $pull: {
            users: userId,
          },
        });
      }
      // Update user with company
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            company: companyObj._id,
          },
        },
        { new: true },
      );

      // Update company with user
      const updateCompanyObj = await Company.findByIdAndUpdate(
        companyObj._id,
        {
          $push: {
            users: userId,
          },
        },
        { new: true },
      );

      return {
        company: updateCompanyObj,
        user: updateUser,
      };
    } catch (error: any) {
      throw new Error(`Error while creating company: ${error.message}`);
    }
  }

  public async pushEmployee(userId: any, companyId: any, prevCompany?: any) {
    try {
      if (prevCompany) {
        const updateCompany = await Company.findByIdAndUpdate(
          prevCompany,
          {
            $pull: {
              users: userId,
            },
          },
          {
            new: true,
          },
        );
      }
      const updateCompany = await Company.findByIdAndUpdate(
        companyId,
        {
          $push: {
            users: userId,
          },
        },
        {
          new: true,
        },
      );
      return updateCompany;
    } catch (error: any) {
      throw new Error(`Error while pushing Employee`);
    }
  }

  public async getCompanyById(companyId: any) {
    try {
      const company = await Company.findById(companyId).populate("jobs").lean();
      return company;
    } catch (error: any) {
      throw new Error(`Error while getting employee object`);
    }
  }
}

export default CompanyRepo;
