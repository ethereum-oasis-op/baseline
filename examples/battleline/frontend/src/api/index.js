export const authUser = async (email, password) => {
  const res = await fetch(
    "https://ident.provide.services/api/v1/authenticate",
    {
      body: JSON.stringify({
        email,
        password,
      }),
      method: "POST",
    }
  );
  return await res.json();
};

export const getOrganization = async (token) => {
  const res = await fetch(
    "https://ident.provide.services/api/v1/organizations",
    {
      headers: {
        authorization: `bearer ${token}`,
        "content-type": "application/json",
      },
    }
  );
  return await res.json();
};

export const getVault = async (token) => {
  const res = await fetch("https://vault.provide.services/api/v1/vaults", {
    headers: {
      authorization: `bearer ${token}`,
    },
  });
  return await res.json();
};

export const authOrg = async (token, orgId) => {
  const res = await fetch("https://ident.provide.services/api/v1/tokens", {
    headers: {
      authorization: `bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({ organization_id: orgId }),
  });
  return await res.json();
};

export const getKeys = async (token, id) => {
  const res = await fetch(
    `https://vault.provide.services/api/v1/vaults/${id}/keys`,
    {
      headers: {
        authorization: `bearer ${token}`,
      },
    }
  );
  return await res.json();
};

export const deployContract = async (token) => {
  const res = await fetch(
    `https://nchain.provide.services/api/v1/contracts`,
    {
      body: JSON.stringify({}),
      headers: {
        authorization: `bearer ${token}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );
  return await res.json();
};
