import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input } from 'antd';
import { auth, firestore, storage } from 'firebase';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoAtom } from 'stores/atom/user';

const UserInfo:React.FunctionComponent = () =>
{
    const [userInfo,setUserInfo] = useRecoilState(userInfoAtom);

    const getUser = () =>
    {
        firestore.getByDoc('Users',auth.currentUser?.uid ?? '').then((userInfo) =>
        {
            setUserInfo(userInfo);
        });
    };

    useEffect(() =>
    {
        getUser();
    },[]);
    

    console.log(userInfo);
    const handleUpdateAvatar = (e: any) =>
    {
        storage.upload(`public/avatar/${auth.currentUser?.uid}.jpg`,e.currentTarget.files[0]).then((response)=>
        {
            firestore.update('Users',auth.currentUser?.uid ?? '',{ avatarUrl: response }).then(()=>
            {
                getUser();
            });
        });
    };
    
    return (
        <Card>
            <Avatar
                size={100}
                icon={!userInfo.avatarUrl && <UserOutlined />}
                src={userInfo?.avatarUrl ?? null}
            />
            <Button
                type='text'
                onClick={(e:any)=>
                {
                    e.currentTarget.children[1].click();
                }}
            ><span>Thay đổi</span>
                <Input
                    style={{ display: 'none' }}
                    type="file"
                    onChange={handleUpdateAvatar}
                />
            </Button>
            
        </Card>
    );
};

export default UserInfo;
