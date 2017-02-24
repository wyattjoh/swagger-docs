# swagger docs

This is a standalone swagger server that allows users to sign in with Github,
simply acts as a transparent redirect off to Github for the [Swagger UI](http://swagger.io/swagger-ui/).

## Config

- `GITHUB_CLIENT_ID` for the Github integration
- `GITHUB_CLIENT_SECRET` for the Github integration
- `ROOT_URL` for passport's support of the Github login integration
- `PORT` port to run the application on
- `SECRET` secret phrase used to key cookies with
- `REDIS_URL` url to the Redis instance used as the backing temporary storage for session data

## License

    MIT License

    Copyright (c) 2017 Wyatt Johnson

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    Swagger UI is Copyright 2016 SmartBear Software Licensed under the Apache
    License, Version 2.0.
