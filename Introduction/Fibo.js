let getFibo = n => {
    let n1=0,n2=1,sum=0;
    console.log(n1);
    console.log(n2);
    while(n > 0)
    {
        sum = n1 + n2;
        console.log(sum);
        n1 = n2;
        n2 = sum;
        n--;
    }
};

getFibo(10)