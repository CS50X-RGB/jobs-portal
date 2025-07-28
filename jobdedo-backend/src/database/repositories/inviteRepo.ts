import InviteModal, { InviteStatus } from "../models/inviteModal";

class InviteRepo {
  constructor() {}
  public async createInvite(userId: any, jobId: any, data: any) {
    try {
      const item = {
        employee: userId,
        jobId: jobId,
        to: data.user,
        status: InviteStatus.INVITE_DONE,
      };
      const newInvite = await InviteModal.create(item);
      return newInvite.toObject();
    } catch (error) {
      throw new Error(`Error while creating invite`);
    }
  }
  public async getInvitesCount(userId: any) {
    try {
      const countInvites = await InviteModal.find({
        to: userId,
        viewed: false,
      }).countDocuments();
      return countInvites;
    } catch (error: any) {
      throw new Error(`Error while getting invites`);
    }
  }

  public async getInvitesForUser(userId: any) {
    try {
      const getInvites = await InviteModal.find({
        to: userId,
      })
        .populate({
          path: "employee",
          populate: {
            path: "company",
          },
        })
        .populate("jobId")
        .lean();

      return getInvites;
    } catch (error: any) {
      throw new Error(`Error while getting invites ${error}`);
    }
  }

  public async updateInvite(inviteId: any, status: any) {
    try {
      let item: any = {};
      if (status === "invite_rejected") {
        item.status = InviteStatus.INVITE_REJECTED;
        item.viewed = true;
      }
      if (status === "invite_viewed") {
        item.status = InviteStatus.INVITE_VIEWED;
        item.viewed = true;
      }
      const updateInvite = await InviteModal.findByIdAndUpdate(inviteId, item, {
        new: true,
      });
      return updateInvite;
    } catch (error: any) {
      throw new Error(`Updating Invites for the employee`);
    }
  }
}

export default InviteRepo;
