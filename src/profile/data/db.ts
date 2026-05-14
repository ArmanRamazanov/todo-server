import { UserModel } from "@/registration/data/UserSchema.js";
import { serverErrorHandler } from "@/src/serverErrorHandler.js";
import type { UpdateInput, userWithoutPassword } from "@/types/User.types.js";

class ProfileDB {
  async getProfile(
    userId: string,
  ): Promise<Pick<userWithoutPassword, "profile">> {
    try {
      const userProfile = await UserModel.findById(userId).select("profile");

      if (!userProfile) {
        throw {
          status: 404,
          field: null,
          message: "The profile was not found",
          isManual: true,
        };
      }

      return userProfile;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async changeProfile(
    userId: string,
    input: UpdateInput,
  ): Promise<Pick<userWithoutPassword, "profile">> {
    try {
      const user = await UserModel.findById(userId);
      const { firstName, lastName, bio } = input;

      if (!user) {
        throw {
          status: 404,
          field: null,
          message: "The profile was not found",
          isManual: true,
        };
      }
      if (firstName) {
        user.profile.firstName = firstName;
      }
      if (lastName) {
        user.profile.lastName = lastName;
      }
      if (bio) {
        user.profile.bio = bio;
      }

      await user.save();
      const { profile, ...noProfile } = user.toObject();

      return { profile };
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }
}

export default new ProfileDB();
