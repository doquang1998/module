import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import Profile from ".";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "Profile",
  component: Profile,
}

const Template: StoryFn<any> = (args) => <Profile {...args} />;

export const ProfilePage = Template.bind({});

ProfilePage.args = {
  redirectProfile: () => {},
  handleUpdateAvatar: () => {},
};