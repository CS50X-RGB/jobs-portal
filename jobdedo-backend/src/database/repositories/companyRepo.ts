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
}

export default CompanyRepo;
