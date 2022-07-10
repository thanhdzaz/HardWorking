export const iconRotate = (deg:number):any =>
{
    return ({
        onMouseOver: (e)=>
        {
            e.currentTarget.style.rotate = `${deg}deg`;
        },
        onMouseLeave: (e)=>
        {
        
            e.currentTarget.style.rotate = '0deg';
          
        },
        style: {
            transition: '200ms linear',
        },
    });
};
