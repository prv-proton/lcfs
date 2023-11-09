// Import the necessary modules
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Import the component from your component file
import DefaultNavbar from 'components/Navbars/DefaultNavbar';
import BCBox from 'components/BCBox';

// Define the metadata for the story
export default {
  title: 'LCFS/DefaultNavbar',
  component: DefaultNavbar,
  argTypes: {
  },
};

// Define a template for the component
const Template = (args) => (
  <Router>
    <DefaultNavbar {...args} />
    {/*Only for testing below Box is added */}
    <BCBox>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
    </BCBox>
    <BCBox>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
    </BCBox>
    <BCBox>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
      <p>Enim qui excepteur magna eiusmod labore amet aliqua. Incididunt est laboris adipisicing proident sit amet. Labore nostrud veniam voluptate quis ex eu consectetur consequat voluptate nisi est ad. Commodo culpa cillum quis laboris esse adipisicing enim deserunt aliquip eu ad sint. Incididunt amet sint pariatur nulla culpa consequat fugiat. Dolor mollit culpa velit ut laborum est sit. Ex ut dolor nulla culpa in esse consectetur dolore commodo fugiat irure.

        Duis elit labore id voluptate nisi deserunt Lorem in non ea velit occaecat consectetur quis. Consequat fugiat aliquip nisi pariatur commodo deserunt esse dolore ut aliquip dolore sit ipsum anim. Sit aliquip elit laborum et consectetur adipisicing non elit aliquip ex. Labore consequat sunt excepteur adipisicing deserunt qui. Deserunt nostrud voluptate velit qui fugiat irure occaecat nisi amet officia reprehenderit amet deserunt occaecat. Consequat proident non reprehenderit cupidatat sit nulla in Lorem ad excepteur deserunt.</p>
    </BCBox>
  </Router>
);

// Define the different stories
export const Default = Template.bind({});
Default.args = {
};