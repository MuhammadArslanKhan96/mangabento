import { supabase } from '@/modules';
import {  NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth:
 *  post:
 *      tags:
 *          - Authorization
 *      summary: "Returns Authorization Token"
 *      description: "Authorizes default users with username and password set as root to use the endpoints"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              required: true
 *                          password:
 *                              type: string
 *                              required: true
 *              example:
 *                  email: "user@root.com"
 *                  password: "root"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *          400:
 *              description: "Error"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                      example:
 *                          "Invalid Credentials"
 *
 */

export async function POST(request:Request) {
      const res = await request.json();
      const { data, error } = await supabase.auth.signInWithPassword(res);
      if(error!== null) {
        return new Response(error.message, {
            status: 400
        })
      }
    return NextResponse.json({
        data:data.session?.access_token
    });
}

