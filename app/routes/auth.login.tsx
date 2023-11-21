import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useSearchParams } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import { type action, loginFormSchema } from "./resources.auth.login";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { PATH_PAGE } from "~/config/path";
import useToggle from "~/hooks/useToggle";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Mui
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn({
  formError,
}: {
  redirectTo?: string;
  formError?: string | null;
}) {
  const [searchParams] = useSearchParams();
  const { toggle, handleToggle } = useToggle({});
  const loginFetcher = useFetcher<typeof action>();
  const [form, fields] = useForm({
    id: "inline-login",
    defaultValue: {
      redirectTo: searchParams.get("redirectTo") || PATH_PAGE.root,
    },
    constraint: getFieldsetConstraint(loginFormSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: loginFormSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <loginFetcher.Form
          method="POST"
          action={"/resources/auth/login"}
          name="login"
          className="relative flex h-full w-full flex-col justify-center gap-6"
          {...form.props}
        >
          <input
            value={toggle ? "on" : ""}
            className="hidden"
            onChange={() => {}}
            {...conform.input(fields.remember)}
          />
          <input name="redirectTo" hidden defaultValue={PATH_PAGE.root} />
          <div className="flex flex-col gap-1">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            {fields.email.errors &&
              fields.email.errors.map((error, index) => (
                <Typography
                  sx={{ fontSize: 12, color: "red" }}
                  key={error + index}
                >
                  {error}
                </Typography>
              ))}
          </div>
          <div className="flex flex-col gap-1">
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {fields.password.errors &&
              fields.password.errors.map((error, index) => (
                <Typography
                  sx={{ fontSize: 12, color: "red" }}
                  key={error + index}
                >
                  {error}
                </Typography>
              ))}
          </div>

          <FormControlLabel
            value={toggle}
            onChange={handleToggle}
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </loginFetcher.Form>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
