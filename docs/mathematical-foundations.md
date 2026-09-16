---
title: Mathematical Foundations
sidebar_label: Mathematical Foundations
---

The mathematical foundations of the SimPhant Program Solver are based on the math and physics formulations as defined in the A.A. Shabana's book "Computational Dynamics" focusing specifically on the Differential-Algebraic Equation (DAE) formulation for a rigid multi-body systems.

## State Vector and Quaternions

For every moving Rigid Body, the state is defined by a single 1D numerical array, the State Vector:

$$
\mathbf{Y \ } = \  \left\lbrack \mathbf{q} \mathbf{, \ } \dot{\mathbf{q}} \right\rbrack^{T}
$$

The State vector is defined by two vectors:

Position and orientation: $$\mathbf{q} = \left\lbrack x , \  y , \  z , \  q_{w} , \  q_{x} , \  q_{y} , \  q_{z} \right\rbrack^{T}$$,

Translational and angular Velocities: $$\dot{\mathbf{q}} = \left\lbrack v_{x} , \  v_{y} , \  v_{z} , \  \omega_{x} , \omega_{y} , \  \omega_{z} \right\rbrack^{T}$$.

Where:

$$\mathbf{r} = [ x , y , z ]^{T}$$ the Body spatial position vector,

$$\mathbf{v} = \left\lbrack v_{x} , v_{y} , v_{z} \right\rbrack^{T}$$ the Body translational Velocity vector,

$$\mathbf{\omega} = \left\lbrack \omega_{x} , \omega_{y} , \omega_{z} \right\rbrack^{T}$$ the Body Angular Velocity vector in Local Body RF,

**Quaternions** $$( q_{w} , \  q_{x} , \  q_{y} , \  q_{z} )$$ define the Body orientation: angular position of the Body principal axes in the Global RF.

Quaternions are used to prevent the Gimbal Lock situation during the integration (which could instantly crash the DAE solver), and due to the SciPy's Rotation class is heavily optimized for Quaternions.

The Quaternions are converted into a Rotation Matrix:

$$
A = \begin{bmatrix}1 \  - \  2 \left( q_{y}^{2} + \  q_{z}^{2} \right) & 2 \left( q_{x} q_{y} - \  q_{w} q_{z} \right) & 2 \left( q_{x} q_{z} + \  q_{w} q_{y} \right) \\ 2 \left( q_{x} q_{y} + \  q_{w} q_{z} \right) & 1 \  - \  2 \left( q_{x}^{2} + \  q_{z}^{2} \right) & 2 \left( q_{y} q_{z} - \  q_{w} q_{x} \right) \\ 2 \left( q_{x} q_{z} - \  q_{w} q_{y} \right) & 2 \left( q_{y} q_{z} + \  q_{w} q_{x} \right) & 1 \  - \  2 \left( q_{x}^{2} + \  q_{y}^{2} \right)\end{bmatrix}
$$

The Rotation Matrix is converted into Euler Angles (Z-Y-X Tait–Bryan angles) solely to update PyVista's 3D graphics on the screen (Viewport):

$$
\begin{cases}\theta_{z} = \arctan \left( \frac{A_{21}}{A_{11}} \right) \\ \theta_{y} = \arcsin \left( - A_{31} \right) \\ \theta_{x} = \arctan \left( \frac{A_{32}}{A_{33}} \right)\end{cases}
$$

The relation between the first time derivative of the body quaternions in 3D space and the Body angular velocity vector in the Body local reference frame:

$$
\dot{\mathbf{q}} = \frac{1}{2} \mathbf{G}^{T} \mathbf{\omega}
$$

Where **G** is a matrix constructed from the current quaternion values.

## Centroidal Body Coordinate System

Centroidal body coordinate system is considered in the simulation architecture. It is a special case in the spacial dynamics when the reference point is selected to be the center of mass of the body. In this case, the mass matrix of a rigid body is diagonal, and the vector of centrifugal forces is identically equal to zero. In case of Centroidal Coordinate System (origin exactly at the CoG) the translational and rotational equations of a rigid body are mathematically decoupled, which simplifies the Mass Matrix to a block-diagonal constant matrix of size $$6 N \  \times \  6 N$$ , where N is the number of Bodies in the simulation. For a single Body_i, its local 6 × 6 mass matrix $$\mathbf{M}_{\mathbf{i}}$$ is perfectly decoupled into a 3 × 3 mass block and a 3 × 3 inertia block:

$$
\mathbf{M}_{\mathbf{i}} = \begin{bmatrix}m_{i} & 0 & 0 & 0 & 0 & 0 \\ 0 & m_{i} & 0 & 0 & 0 & 0 \\ 0 & 0 & m_{i} & 0 & 0 & 0 \\ 0 & 0 & 0 & J_{x x} & 0 & 0 \\ 0 & 0 & 0 & 0 & J_{y y} & 0 \\ 0 & 0 & 0 & 0 & 0 & J_{z z}\end{bmatrix}
$$

Where $$m_{i}$$ is the mass, and $$\widehat{\mathbf{J}}$$ are the Principal Moments of Inertia of the Body_i.

The Global System Mass Matrix:

$$
\mathbf{M} = \begin{bmatrix}M_{1} & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & M_{n}\end{bmatrix}
$$

The use of a Centroidal body coordinate system is one of the basic assumptions made in developing the fundamental Newton–Euler equations considered in the Solver:

$$
\begin{bmatrix}M & \Phi_{q}^{T} \\ \Phi_{q} & 0\end{bmatrix} \begin{bmatrix}\ddot{q} \\ \lambda\end{bmatrix} = \begin{bmatrix}Q \\ \gamma\end{bmatrix}
$$

Where:

$$\mathbf{M}$$: The Mass/Inertia matrix (size $$n \  \times n$$),

$$\mathbf{\Phi}_{\mathbf{q}}$$: The Constraint Jacobian matrix (size $$m \  \times n$$),

$$\ddot{\mathbf{q}}$$: The unknown system accelerations (size $$n \  \times 1$$),

$$\mathbf{\lambda}$$: The unknown constraint reaction forces (size $$m \  \times 1$$),

$$\mathbf{Q}$$: The known external forces and torques,

$$\mathbf{\gamma}$$: The known right-hand side kinematic accelerations,

$$n = 6 N$$ is the number of degrees of freedom (DOFs) and $$m$$ is the number of constraints.

In Multi-Body Dynamics, the simulation process reduces to solving the Augmented Mass Matrix to find accelerations $$\ddot{q}$$ and Lagrange multipliers $$\lambda$$ representing the Joints reactions.

## Hybrid Formulation

Following Shabana’s spatial Newton-Euler formulation, the Newton-Euler equations with kinematic constraints are defined using a **Hybrid Formulation** (also called the Mixed Coordinate Formulation). Two basic assumptions are considered.

1\. Translations are solved in the GLOBAL Frame:

The position $$\mathbf{r} = [ x , y , z ]^{T}$$ and translational forces $$\mathbf{F \ }$$are evaluated globally. This simplifies the writing of the Joint constraints $$\Phi$$, as Joints physically connect Bodies in Global space.

2\. Rotations are solved in the LOCAL (Body-Fixed) Frame:

The angular velocity $$\overline{\mathbf{\omega}} = \  \left\lbrack \overline{\omega_{x}} , \  \overline{\omega_{y}} , \  \overline{\omega_{z}} \right\rbrack^{T}$$ and torques $$( \mathbf{T )}$$ are evaluated locally, because the Inertia Tensor ($$\widehat{\mathbf{J}}$$) is strictly constant in the Body Local reference frame. Since mass is also constant, the entire unconstrained Mass Matrix is 100% constant. It is constructed exactly once when the program starts, as well as its inverse matrix for the Schur Complement method.

## Physics Engine Architecture & Data Flow

SciPy integrators and vectorized custom algorithms require the entire system's state to be a single 1D numerical array, the State Vector:

$$
\mathbf{Y \ } = \  \left\lbrack \mathbf{q} \mathbf{, \ } \dot{\mathbf{q}} \right\rbrack^{T}
$$

For N moving bodies, $$\mathbf{q}$$ (positions/angles) has size 7N, and $$\dot{\mathbf{q}}$$ (velocities) has size 6N.

The total size of $$\mathbf{Y}$$ is 13N.

The simulation architecture is separated on the physics formulation from the time advancement.

-   **The System Evaluator:** A single, master function that takes the current time (t) and the current state vector ($$\mathbf{Y}$$), builds the matrices, solves the linear equations, and returns the accelerations.
-   **The Integrator:** The algorithm (RK4, Euler, BDF, etc.) that asks the System Evaluator for accelerations, and uses them to advance the state vector to the next time step ($$t \  + \  \Delta t$$).

**Step 1: Data Collection & Initialization (The Object-Oriented Layer)**

The engine begins in the UI layer, where the user defines the 3D world.

**1.1 The User Interface Objects**

The 3D CAD data and user configurations are stored in high-level Python classes, as following:

-   **RigidBody**: Stores mass, center of gravity (cog), inertia tensors, and the initial kinematic state (position, velocity, quaternion, angular velocity).
-   **Joint**: Stores the topological connection between two bodies (body_i, body_j), the joint type (e.g., Revolute, Prismatic), and the local spatial vectors defining the anchor points and sliding/rotation axes.
-   **Force**: Stores user-defined external forces, torques, and gravity vectors.

**1.2 Solver Initialization (MBSolver.__init__)**

When the Core Multibody Dynamics Solver (MBSolver) is instantiated, it makes preprocessing of the input data:

-   **Ground Filtration:** It filters out the "Ground" body, creating a list of only moving bodies. The solver strictly ignores the ground's degrees of freedom (reducing the matrix size) and treats it as an infinite-mass anchor (Index: -1).
-   **Body Mapping:** It assigns a strict integer index to every moving body (body_index_map).
-   **Mass Matrix (**$$\mathbf{M}$$**) Pre-computation:** Because the mass and local inertia of rigid bodies never change, the Solver builds the global 6NX6N block-diagonal Mass Matrix ($$\mathbf{M}$$) once.

**1.3 Static Data Packing for Numba (prepare_static_numba_data)**

Because the Numba JIT compiler (C-level code) cannot read Python objects, the solver extracts the immutable Joint properties (types, body indices, local anchors, and local axes) and flattens them into contiguous 1D and 2D NumPy arrays. This happens exactly once before the simulation starts.

**Step 2: The Execution Flow (The Integration Layer)**

When the user clicks ‘Solve’ button, The UI reads the chosen integration method (e.g., RK4, BDF, Symplectic Euler) which takes complete control of the time-loop. Whether it is a custom explicit loop (like Euler) or a complex SciPy implicit solver (like BDF), the **Integrator** treats the physical system as a „black-box“ First-Order Ordinary Differential Equation (ODE):

$$
\frac{d Y}{d t} = f ( t , Y )
$$

To figure out how the system moves, the Integrator repeatedly calls the **Core Mathematical Evaluator**: evaluate_derivatives(t, Y) method. This is the "Gatekeeper" method.

**Step 3: Building the KKT Matrix (Inside evaluate_derivatives)**

Every time the Integrator needs to know the accelerations, it passes the current time (t) and state vector ($$\mathbf{Y}$$) into evaluate_derivatives(t, Y) method, which executes the following sequence:

**3.1 State Unpacking & Forces (**$$\mathbf{Q}$$**)**

-   **unpack_state(Y)** method maps the flat vector $$\mathbf{Y}$$ back into the 3D RigidBody objects, updating their global rotation matrices ($$\mathbf{A}$$) and velocities ($$\dot{\mathbf{q}}$$).
-   **build_force_vector()** method assembles the unconstrained Right-Hand Side Force vector

    $$
    \mathbf{Q =} \mathbf{Q}_{\mathbf{e}} \mathbf{+} \mathbf{Q}_{\mathbf{v}}
    $$

Where

$$\mathbf{Q}_{\mathbf{e}} \mathbf{=} \mathbf{Q}_{\mathbf{e x t e r n a l}}$$ : external Forces, Gravity and Springs.

$$\mathbf{Q}_{\mathbf{v}} \mathbf{=} \mathbf{Q}_{\mathbf{v e l o c i t y}}$$ : calculated gyroscopic Coriolis Forces caused by the Bodies rotating: $$\overline{\omega} \times \left( I \overline{\omega} \right)$$.

**3.2 The Jacobian Assembly (**$$\mathbf{\Phi}_{\mathbf{q}}$$ **and** $$\mathbf{\gamma}^{\mathbf{*}}$$**)**

Iteration through all Joints and evaluation the kinematics to build:

-   $$\mathbf{\Phi}_{\mathbf{q}}$$ **(The Jacobian):** The matrix of spatial directions that degrees of freedom are restricted in.
-   $$\mathbf{\gamma}^{\mathbf{*}}$$ **(The Right-Hand Side Accelerations):** Contains the centripetal and Coriolis accelerations of the joints ($$\gamma$$), adjusted by the **Baumgarte Stabilization** terms ($$- 2 \alpha \dot{\Phi} - \beta^{2}$$) to prevent joints from drifting apart.

**Step 4: Solving the DAE (The Schur Complement)**

With $$M , Q , \Phi_{q} ,$$ and $$\gamma^{*}$$ assembled, the system forms the classic **KKT (Karush-Kuhn-Tucker)** augmented matrix:

$$
\begin{bmatrix}M & \Phi_{q}^{T} \\ \Phi_{q} & 0\end{bmatrix} \begin{bmatrix}\ddot{q} \\ \lambda\end{bmatrix} = \begin{bmatrix}Q \\ \gamma^{*}\end{bmatrix}
$$

which is solved for Lagrange Multipliers $$\mathbf{\lambda}$$ and accelerations $$\ddot{\mathbf{q}}$$ using highly optimized **Schur Complement** method.

**Step 5: Returning to the Integrator**

The Bodies velocities ($$\dot{\mathbf{q}}$$) and the newly calculated accelerations ($$\ddot{\mathbf{q}}$$) return to the **Integrator** (selected by user), which steps the system forward in time. Then the cycle repeats from Step 3 until the simulation finishes.

### Schur Complement method (solving the KKT)

The Schur Complement is used instead of a standard matrix solver (e.g. Gaussian Elimination). Mathematical derivation and the structural advantages of the Schur Complement method.

**The Mathematics of the Schur Complement**

In multibody dynamics, the physical system is defined by a system of Differential Algebraic Equations (DAEs). When expressed in matrix form, it creates the classic KKT (Karush-Kuhn-Tucker) augmented matrix:

$$
\begin{bmatrix}M & \Phi_{q}^{T} \\ \Phi_{q} & 0\end{bmatrix} \begin{bmatrix}\ddot{q} \\ \lambda\end{bmatrix} = \begin{bmatrix}Q \\ \gamma^{*}\end{bmatrix}
$$

Where:

$$\mathbf{M}$$: The Mass/Inertia matrix (size $$n \  \times n$$).

$$\mathbf{\Phi}_{\mathbf{q}}$$: The Constraint Jacobian matrix (size $$m \  \times n$$).

$$\ddot{\mathbf{q}}$$: The unknown system accelerations (size $$n \  \times 1$$).

$$\mathbf{\lambda}$$: The unknown constraint reaction forces (size $$m \  \times 1$$).

$$\mathbf{Q}$$: The known external forces and torques.

$$\mathbf{\gamma}^{\mathbf{*}}$$: The known right-hand side kinematic accelerations ($$\gamma$$) with Baumgarte Stabilization:

$$
\gamma^{*} = \gamma - 2 \alpha \dot{\Phi} - \beta^{2}
$$

$$n$$ is the number of degrees of freedom (DOFs) and $$m$$ is the number of constraints.

**The Derivation**

If we unpack the matrix into two separate equations, we get:

1.  The Dynamics Equation **:** $$M \ddot{q} + \Phi_{q}^{T} \lambda = Q$$
2.  The Kinematic Equation **:** $$\Phi_{q} \ddot{q} = \gamma^{*}$$

The Schur Complement method solves this by algebraic substitution. First, we isolate the accelerations ($$\ddot{\mathbf{q}}$$) in Equation 1 by multiplying by the inverse of the mass matrix ($$\mathbf{M}^{\mathbf{- 1}}$$):

$$
\ddot{q} = M^{- 1} \left( Q - \Phi_{q}^{T} \lambda \right)
$$

Next, we substitute this expression for $$\ddot{q}$$ directly into Equation 2:

$$
\Phi_{q} \left( M^{- 1} \left( Q - \Phi_{q}^{T} \lambda \right) \right) = \gamma^{*}
$$

Now, we distribute $$\Phi_{q}$$ and rearrange the equation to isolate the unknown reaction forces ($$\lambda$$) on the left side:

$$
\left( \Phi_{q} M^{- 1} \Phi_{q}^{T} \right) \lambda = \Phi_{q} M^{- 1} Q - \gamma^{*}
$$

We have now condensed the system into a single linear equation: $$C \lambda = \text{RHS}$$

Where:

-   $$C = \Phi_{q} M^{- 1} \Phi_{q}^{T}$$ is the **Schur Complement Matrix** (sometimes called the lead or mass-orthogonalized Jacobian matrix).
-   $$\text{RHS} = \Phi_{q} M^{- 1} Q - \gamma^{*}$$ is the known right-hand side vector.

Once we solve $$C \lambda = \text{RHS}$$ for the Lagrange multipliers ($$\lambda$$), we substitute them back into the dynamics equation to effortlessly calculate the final accelerations ($$\ddot{q}$$).

### Tikhonov Regularization Solution

When a kinematic chain forms a closed loop (like a four-bar linkage) or when multiple joints restrict the same degree of freedom, the constraint Jacobian matrix ($$\Phi_{q}$$) loses row rank. Without regularization, the Schur complement matrix ($$C$$) becomes singular, the determinant hits zero, and the Solver immediately crashes with a Singular Matrix exception.

Using **Tikhonov Regularization** instead of making the constraints infinitely rigid, it injects a microscopic amount of "compliance" (elasticity) directly into the matrix diagonal. This fixes the singular matrix instantly without changing the matrix size. We replace the bottom-right 0 block with $$- \epsilon I$$, then the system becomes:

$$
\begin{bmatrix}\mathbf{M} & \mathbf{\Phi}_{\mathbf{q}}^{\mathbf{T}} \\ \mathbf{\Phi}_{\mathbf{q}} & \mathbf{- \epsilon I}\end{bmatrix} \begin{bmatrix}\ddot{\mathbf{q}} \\ \mathbf{\lambda}\end{bmatrix} \mathbf{=} \begin{bmatrix}\mathbf{Q} \\ \mathbf{\gamma}^{\mathbf{*}}\end{bmatrix}
$$

Where:

$$\epsilon$$ is the value (for example: -1E-7) physically represents Constraint Compliance (m/N), the exact opposite of Stiffness,

$$I = \begin{bmatrix}1 & \cdots & 0 \\ \vdots & 1 & \vdots \\ 0 & \cdots & 1\end{bmatrix}$$ is the Identity matrix.

When we perform the block matrix elimination to build the **Schur Complement** ($$C$$) that we use to solve for the Lagrange multipliers ($$\lambda$$), the equation transforms from $$C = \Phi_{q} M^{- 1} \Phi_{q}^{T}$$ into:

$$
C_{r e g} = \Phi_{q} M^{- 1} \Phi_{q}^{T} + \epsilon I
$$

By simply adding $$\epsilon$$ to the main diagonal of the $$C$$ matrix, we guarantee that all eigenvalues are strictly greater than zero, the matrix becomes unconditionally positive-definite and impossible to crash.

**The Schur Complement approach provides the massive advantages** over Standard Gaussian Elimination. The full KKT matrix has a dimension of $$( n + m ) \times ( n + m )$$, where $$n$$ is the number of degrees of freedom (DOFs) and $$m$$ is the number of constraints. By using the Schur Complement, we reduce the unknown matrix from size $$( n + m ) \times ( n + m )$$ down to just $$m \  \times m$$. Because $$M$$ is constant in local frames, its inverse ($$M^{- 1}$$) is pre-calculated or pre-factorized once. Solving a small $$m \  \times m$$ matrix every frame is drastically faster than solving the giant KKT matrix by Standard Gaussian Elimination.

## Kinematic Constraints (Joints) and Jacobian Matrices

This chapter describes the mathematical foundation of the Joints Constraints.

### Spherical Joint Kinematic Formulation

In Multi-Body Dynamics, the Spherical Joint (often called a Ball-and-Socket joint) restricts 3 translational degrees of freedom but allows all 3 rotational degrees of freedom.

Definition of terms:

-   $$r_{i} , r_{j}$$: Global 3D Position vectors of the Center of Gravity (CoG) for Body i and Body j.
-   $$A_{i} , A_{j}$$: $$3 \  \times 3$$ Global Rotation Matrices for Body i and Body j.
-   $$\overline{u_{i}} , \overline{u_{j}}$$: **Local** 3D vectors from the CoG to the joint anchor point on Body_i and Body_j.
-   $$\overline{\omega_{i}} , \overline{\omega_{j}}$$: **Local** 3D angular velocity vectors.
-   $$\widetilde{u}$$: The $$3 \  \times 3$$ skew-symmetric matrix of vector $$\mathbf{u}$$, which mathematically executes a cross product $$\left( \widetilde{u} x = u \times x \right)$$.

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

The physical definition of a spherical Joint is that the anchor point on Body_i must occupy the exact same global space as the anchor point on Body_j at all times.

The global position of the anchor on Body_i is: $$r_{i} + A_{i} \overline{u_{i}}$$.

Therefore, the constraint equation yields **3 rows** (X, Y, Z) in our system:

$$
\Phi ( q , t ) = r_{i} + A_{i} \overline{u_{i}} - r_{j} - A_{j} \overline{u_{j}} = \begin{bmatrix}0 \\ 0 \\ 0\end{bmatrix}
$$

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

In general, the Constraint Jacobian matrix is deﬁned as:

$$
\Phi_{q} = \begin{bmatrix}\frac{\partial \Phi_{1}}{\partial q_{1}} & \frac{\partial \Phi_{1}}{\partial q_{2}} & \frac{\partial \Phi_{1}}{\partial q_{3}} & \cdots & \frac{\partial \Phi_{1}}{\partial q_{n}} \\ \frac{\partial \Phi_{2}}{\partial q_{1}} & \frac{\partial \Phi_{2}}{\partial q_{2}} & \frac{\partial \Phi_{2}}{\partial q_{3}} & \cdots & \frac{\partial \Phi_{2}}{\partial q_{n}} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ \frac{\partial \Phi_{m}}{\partial q_{1}} & \frac{\partial \Phi_{m}}{\partial q_{2}} & \frac{\partial \Phi_{m}}{\partial q_{3}} & \cdots & \frac{\partial \Phi_{m}}{\partial q_{n}}\end{bmatrix}
$$

Where:

n is the number of system coordinates,

m is the number of the constraint equations.

To find the Jacobian for the Hybrid Formulation, we take the first time derivative of the position constraint ($$\dot{\Phi} = 0$$). We must isolate our state velocities: global linear velocity ($$v$$) and local angular velocity ($$\overline{\omega}$$).

The velocity of the anchor point is:

$$
\dot{\Phi} = v_{i} + A_{i} \left( \overline{\omega_{i}} \times \overline{u_{i}} \right) - v_{j} - A_{j} \left( \overline{\omega_{j}} \times \overline{u_{j}} \right) = 0
$$

Using the skew-symmetric property ($$\overline{\omega} \times \overline{u} = - \widetilde{u} \overline{\omega}$$), we rewrite this to extract the Jacobian coefficients that will go into the Augmented Matrix:

$$
\dot{\Phi} = [ I ] v_{i} + \left\lbrack - A_{i} \widetilde{\overline{u}_{i}} \right\rbrack \overline{\omega_{i}} + [ - I ] v_{j} + \left\lbrack A_{j} \widetilde{\overline{u}_{j}} \right\rbrack \overline{\omega_{j}} = 0
$$

From this, we extract the $$3 \  \times 12$$ **Jacobian Matrix (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)** **blocks for the Spherical Joint**:

$$
\Phi_{q} = \begin{bmatrix}I_{3 \times 3} & - A_{i} \widetilde{\overline{u}_{i}} & - I_{3 \times 3} & A_{j} \widetilde{\overline{u}_{j}}\end{bmatrix}
$$

### Revolute Joint Kinematic Formulation

A revolute Joint removes 5 DOFs, leaving exactly 1 rotational DOF (spinning around the hinge axis). Mathematically, it is constructed by combining two distinct constraints:

1.  **A Spherical Constraint (3 rows):** Keeps the anchor point of Body_i attached to the anchor point of Body_j.
2.  **Two Dot-1 (Orthogonality) Constraints (2 rows):** Keeps the hinge axis on Body_i perfectly parallel to the hinge axis on Body_j.

**Definition of vectors:**

To prevent the hinge from bending, we define a "Hinge Z-axis" ($$v$$) and two orthogonal "Plane axes" ($$\mathbf{a}$$ and $$\mathbf{b}$$).

-   $$\overline{u_{i}} , \overline{u_{j}}$$: **Local** anchor points (from CoG to the joint).
-   $$\overline{v_{i}}$$: The **Local** hinge Z-axis vector on Body_i.
-   $$\overline{a_{j}} , \overline{b_{j}}$$: The **Local** X-axis and Y-axis vectors on Body_j (perpendicular to the hinge).
-   $$v_{i} , a_{j} , b_{j}$$: The **Global** versions of those vectors (e.g., $$v_{i} = A_{i} \overline{v_{i}}$$).

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

The constraint matrix yields **5 rows**. The first three are the identical spherical constraint we built previously. The last two force the hinge axis of Body_i to remain exactly 90 degrees orthogonal to the X and Y plane axes of Body_j. If $$v_{i}$$ is perfectly orthogonal to $$a_{j}$$ and $$b_{j}$$, it is mathematically locked parallel to $$v_{j}$$.

$$
\Phi ( q , t ) = \begin{bmatrix}r_{i} + A_{i} \overline{u_{i}} - r_{j} - A_{j} \overline{u_{j}} \\ v_{i} \cdot a_{j} \\ v_{i} \cdot b_{j}\end{bmatrix} = \begin{bmatrix}0 \\ 0 \\ 0 \\ 0 \\ 0\end{bmatrix}
$$

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

To find the Jacobian, we take the first time derivative of the constraints. We already know the first 3 rows (the Spherical blocks). We only need to derive the Dot-1 constraints (rows 4 and 5).

The time derivative of a dot product between two rotating global vectors is:

$$
\frac{d}{d t} \left( v_{i} \cdot a_{j} \right) = \dot{v_{i}} \cdot a_{j} + v_{i} \cdot \dot{a_{j}} = 0
$$

Because global vector velocities are derived via cross products ($$\dot{v_{i}} = \omega_{i} \times v_{i}$$), we can rearrange the scalar triple products to isolate our state velocities ($$v$$ and $$\overline{\omega}$$). This yields the exact rotational Jacobian blocks for the Augmented Matrix:

**Row 4 (Orthogonality to** $$\mathbf{a}_{\mathbf{j}}$$**):**

-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times a_{j} \right)$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( a_{j} \times v_{i} \right)$$

**Row 5 (Orthogonality to** $$\mathbf{b}_{\mathbf{j}}$$**):**

-   Body i Rotational Block: $$A_{i}^{T} \left( v_{i} \times b_{j} \right)$$
-   Body j Rotational Block: $$A_{j}^{T} \left( b_{j} \times v_{i} \right)$$

The Translational Jacobian blocks for rows 4 and 5 are exactly zero [0, 0, 0], because purely rotating a Body does not translate its center of gravity.

**The Fully Assembled** 5 × 12 **Jacobian Block for Revolute Joint:**

$$
\Phi_{q} = \begin{bmatrix}I_{3 \times 3} & - A_{i} \widetilde{\overline{u}_{i}} & - I_{3 \times 3} & A_{j} \widetilde{\overline{u}_{j}} \\ \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{i}^{T} \left( v_{i} \times a_{j} \right) & \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{j}^{T} \left( a_{j} \times v_{i} \right) \\ \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{i}^{T} \left( v_{i} \times b_{j} \right) & \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{j}^{T} \left( b_{j} \times v_{i} \right)\end{bmatrix}
$$

### Prismatic Joint Kinematic Formulation

Prismatic Joint removes 5 Degrees of Freedom:

1.  **Three Dot-1 Constraints (3 rows):** Completely locks the relative rotation between the two Bodies so they cannot twist, pitch, or yaw relative to each other.
2.  **Two Dot-2 Constraints (2 rows):** Forces the anchor point of the slider to remain perfectly inside the mathematical "track" defined by the other body.

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

Definition of vectors:

Let Body_i be the "Track" and Body_j be the "Slider".

-   $$P_{i} , P_{j}$$: The **Global** position of the local anchor points (e.g., $$P_{i} = r_{i} + A_{i} \overline{u_{i}}$$).
-   $$d$$: The **Global distance vector** between the anchors: $$d = P_{j} - P_{i}$$.
-   $$v_{i}$$: The **Global** sliding axis vector (Z-axis) on Body_i.
-   $$a_{i} , b_{i}$$: The **Global** orthogonal plane axes (X-axis, Y-axis) on Body_i.
-   $$a_{j} , b_{j}$$: The **Global** orthogonal plane axes (X-axis, Y-axis) on Body_j.

**The Constraints:**

We must prevent Body_j from rotating relative to Body_i. We do this by forcing their orthogonal axes to remain perfectly 90-degrees to each other using dot products.

Next, we must prevent Body j from sliding off the track. If the slider moves purely along the $$v_{i}$$ axis, then the distance vector d must have zero projection on the Track's $$a_{i}$$ (X-axis) and $$b_{i}$$ (Y-axis).

This yields our **5 rows**:

$$
\Phi ( q , t ) = \begin{bmatrix}v_{i} \cdot a_{j} \\ v_{i} \cdot b_{j} \\ a_{i} \cdot b_{j} \\ d \cdot a_{i} \\ d \cdot b_{i}\end{bmatrix} \, = \begin{bmatrix}0 \\ 0 \\ 0 \\ 0 \\ 0\end{bmatrix}
$$

Rows 1-3 are Rotational Locks. Rows 4-5 are Translational Locks.

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

To build the Augmented Matrix blocks, we take the first derivative ($$\dot{\Phi} = 0$$).

**Rows 1 to 3 (Rotational Locks):**

These are standard Dot-1 constraints (identical to the bending locks in our Revolute joint). Because pure rotation doesn't translate the CoG, their Translational Jacobian blocks are exactly zero [0, 0, 0].

For **Row 1** ($$v_{i} \cdot a_{j} = 0$$):

-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times a_{j} \right)$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( a_{j} \times v_{i} \right)$$

We repeat this pattern for **Row 2** using $$v_{i} , b_{j}$$, and **Row 3** using $$a_{i} , b_{j}$$.

**Rows 4 and 5 (Translational Locks):**

Taking the derivative of $$d \cdot a_{i} = 0$$requires the product rule: $$\dot{\Phi_{4}} = \dot{d} \cdot a_{i} + d \cdot \dot{a_{i}} = 0$$.

By substituting $$\dot{d} = v_{j} + \left( \omega_{j} \times s_{j} \right) - v_{i} - \left( \omega_{i} \times s_{i} \right)$$, where $$s$$ is the global vector from CoG to anchor, we can isolate the velocity state variables to extract the Jacobian blocks:

For **Row 4** ($$d \cdot a_{i} = 0$$):

-   Body_i Translational Block: $$- a_{i}^{T}$$
-   Body_i Rotational Block: $$A_{i}^{T} \left( a_{i} \times \left( d + s_{i} \right) \right)$$
-   Body_j Translational Block: $$a_{i}^{T}$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( s_{j} \times a_{i} \right)$$

**Row 5** uses the exact same structure, replacing $$a_{i}$$ with $$b_{i}$$.

**The Fully Assembled Jacobian Matrix for Prismatic Joint (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

$$
\Phi_{q} = \begin{bmatrix}\begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times a_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( a_{j} \times v_{i} \right) \\ \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times b_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( b_{j} \times v_{i} \right) \\ \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( a_{i} \times b_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( b_{j} \times a_{i} \right) \\ - a_{i}^{T} & A_{i}^{T} \left( a_{i} \times \left( d + s_{i} \right) \right) & a_{i}^{T} & A_{j}^{T} \left( s_{j} \times a_{i} \right) \\ - b_{i}^{T} & A_{i}^{T} \left( b_{i} \times \left( d + s_{i} \right) \right) & b_{i}^{T} & A_{j}^{T} \left( s_{j} \times b_{i} \right)\end{bmatrix}
$$

### Cylindrical Joint Kinematic Formulation

Cylindrical Joint restricts exactly **4 Degrees of Freedom**. It allows Body_j to slide along the Z-axis of Body_i and spin freely around that exact same Z-axis.

Definition of vectors:

Let Body i be the "Track/Shaft" and Body j be the "Collar".

-   $$P_{i} , P_{j}$$: The **Global** position of the local anchor points.
-   $$d$$: The **Global distance vector** between the anchors: $$d = P_{j} - P_{i}$$.
-   $$v_{i}$$: The **Global** sliding/rotation axis vector (Z-axis) on Body_i.
-   $$a_{i} , b_{i}$$: The **Global** orthogonal plane axes (X-axis, Y-axis) on Body_i.
-   $$a_{j} , b_{j}$$: The **Global** orthogonal plane axes (X-axis, Y-axis) on Body_j.

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

To create a Cylindrical Joint, we use 4 equations:

1.  **Two Rotational Locks (Rows 1 & 2):** We force the Z-axis of the Collar ($$v_{j}$$) to remain perfectly parallel to the Z-axis of the Shaft ($$v_{i}$$). We do this by forcing $$v_{i}$$ to remain 90-degrees orthogonal to the Collar's X and Y axes ($$a_{j} , b_{j}$$). We deliberately omit the 3rd rotational lock $$a_{i} \cdot b_{j} = 0$$, which allows the collar to spin freely.
2.  **Two Translational Locks (Rows 3 & 4):** We force the distance vector $$d$$ to have exactly zero projection on the Shaft's X and Y axes ($$a_{i} , b_{i}$$), ensuring the collar cannot derail from the shaft.

This yields our **4 rows**:

$$
\Phi ( q , t ) = \begin{bmatrix}v_{i} \cdot a_{j} \\ v_{i} \cdot b_{j} \\ d \cdot a_{i} \\ d \cdot b_{i}\end{bmatrix} \, = \begin{bmatrix}0 \\ 0 \\ 0 \\ 0\end{bmatrix}
$$

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

We take the first time derivative ($$\dot{\Phi} = 0$$) to extract the Jacobian blocks for the Augmented Matrix. Since these are the exact same equations used in the Prismatic joint, the Jacobian blocks are identical.

**Rows 1 and 2 (Rotational Locks):**

Pure rotation doesn't translate the CoG, so the Translational Jacobian blocks are exactly zero [0, 0, 0].

For Row 1 ($$v_{i} \cdot a_{j} = 0$$):

-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times a_{j} \right)$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( a_{j} \times v_{i} \right)$$

**Row 2** uses the exact same structure, replacing $$a_{j}$$ with $$b_{j}$$.

**Rows 3 and 4 (Translational Locks):**

Taking the derivative of $$d \cdot a_{i} = 0$$ isolates the velocity state variables. Let $$s_{i}$$ and $$s_{j}$$ be the global vectors from the CoGs to the anchors.

For **Row 3** ($$d \cdot a_{i} = 0$$):

-   Body_i Translational Block: $$- a_{i}^{T}$$
-   Body_i Rotational Block: $$A_{i}^{T} \left( a_{i} \times \left( d + s_{i} \right) \right)$$
-   Body_j Translational Block: $$a_{i}^{T}$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( s_{j} \times a_{i} \right)$$

**Row 4** uses the exact same structure, replacing $$a_{i}$$ with $$b_{i}$$.

**The Fully Assembled Jacobian Matrix for Cylindrical Joint (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

$$
\Phi_{q} = \begin{bmatrix}\begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times a_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( a_{j} \times v_{i} \right) \\ \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times b_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( b_{j} \times v_{i} \right) \\ - a_{i}^{T} & A_{i}^{T} \left( a_{i} \times \left( d + s_{i} \right) \right) & a_{i}^{T} & A_{j}^{T} \left( s_{j} \times a_{i} \right) \\ - b_{i}^{T} & A_{i}^{T} \left( b_{i} \times \left( d + s_{i} \right) \right) & b_{i}^{T} & A_{j}^{T} \left( s_{j} \times b_{i} \right)\end{bmatrix}
$$

### Planar Joint Kinematic Formulation

A Planar Joint removes exactly **3 Degrees of Freedom (DOFs)**:

1.  It restricts translation along the normal vector (keeps the puck on the table).
2.  It restricts pitch and yaw rotations (keeps the puck flat on the table).

It allows the remaining 3 DOFs: free X/Y sliding across the plane, and free spinning around the normal vector.

Definition of vectors:

Let Body_i be the "Plane" (e.g., a table) and Body_j be the "Puck".

-   $$P_{i} , P_{j}$$: The Global position of the local anchor points.
-   $$d$$: The Global distance vector between the anchors: $$d = P_{j} - P_{i}$$.
-   $$v_{i}$$: The Global normal vector to the plane on Body_i (the Z-axis of the joint).
-   $$a_{j} , b_{j}$$: The Global orthogonal plane axes (X-axis, Y-axis) on Body_j.

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

We must prevent Body_j from lifting off the plane and from tilting.

1.  **Two Rotational Locks (Rows 1 & 2):** We force the Puck's plane axes ($$a_{j} , b_{j}$$) to remain perfectly 90-degrees to the Table's normal vector ($$v_{i}$$). This guarantees the two surfaces remain mathematically parallel while allowing the puck to spin freely.
2.  **One Translational Lock (Row 3):** We force the distance vector d to have exactly zero projection on the Table's normal vector ($$v_{i}$$). This locks the puck exactly onto the surface.

This yields our **3 rows**:

$$
\Phi ( q , t ) = \begin{bmatrix}v_{i} \cdot a_{j} \\ v_{i} \cdot b_{j} \\ d \cdot v_{i}\end{bmatrix} \, = \begin{bmatrix}0 \\ 0 \\ 0\end{bmatrix}
$$

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

We take the first time derivative ($$\dot{\Phi} = 0$$) to extract the Jacobian blocks for the Augmented Matrix.

**Rows 1 and 2 (Rotational Locks):**

These are the standard Dot-1 constraints we used in the Revolute and Prismatic joints. Since pure rotation doesn't translate the CoG, the Translational Jacobian blocks are exactly zero [0, 0, 0].

For **Row 1** ($$v_{i} \cdot a_{j} = 0$$):

-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times a_{j} \right)$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( a_{j} \times v_{i} \right)$$

**Row 2** uses the exact same structure, replacing $$a_{j}$$ with $$b_{j}$$.

**Row 3 (Translational Lock):**

Taking the derivative of the dot product $$\dot{\Phi_{3}} = \dot{d} \cdot v_{i} + d \cdot \dot{v_{i}} = 0$$.

By substituting the global velocity kinematics

$$\left( \dot{d} = v_{j} + \left( \omega_{j} \times s_{j} \right) - v_{i} - \left( \omega_{i} \times s_{i} \right) \right)$$,

we isolate the state variables to extract the following Jacobian blocks:

For **Row 3** ($$d \cdot v_{i} = 0$$):

-   Body_i Translational Block: $$- v_{i}^{T}$$
-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times \left( d + s_{i} \right) \right)$$
-   Body_j Translational Block: $$v_{i}^{T}$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( s_{j} \times v_{i} \right)$$

This perfectly mirrors our Prismatic math, just using the single $$v_{i}$$ normal vector instead of the two $$a_{i} , b_{i}$$ track vectors.

**The Fully Assembled Jacobian Matrix (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

$$
\Phi_{q} = \begin{bmatrix}\begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times a_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( a_{j} \times v_{i} \right) \\ \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{i}^{T} \left( v_{i} \times b_{j} \right) & \begin{bmatrix}0 & 0 & 0\end{bmatrix} & A_{j}^{T} \left( b_{j} \times v_{i} \right) \\ - v_{i}^{T} & A_{i}^{T} \left( v_{i} \times \left( d + s_{i} \right) \right) & v_{i}^{T} & A_{j}^{T} \left( s_{j} \times v_{i} \right)\end{bmatrix}
$$

### Fixed Joint Kinematic Formulation

The Fixed Joint (sometimes called a Weld or Lock joint) is the ultimate restriction: it removes all **6 Degrees of Freedom (DOFs)**. It allows zero relative translation and zero relative rotation. The two bodies are permanently welded together, acting as a single rigid body.

A Fixed Joint is simply the Translational Locks of a Spherical Joint glued directly to the Rotational Locks of a Prismatic Joint.

Definition of vectors:

Let Body i be the "Base" and Body j be the "Attachment".

-   $$\overline{u_{i}} , \overline{u_{j}}$$: The **Local** anchor points (from CoG to the joint).
-   $$v_{i} , a_{i} , b_{i}$$: The **Global** orthogonal triad (Z, X, Y axes) on Body i.
-   $$v_{j} , a_{j} , b_{j}$$: The **Global** orthogonal triad (Z, X, Y axes) on Body j.

**1. The Position Constraint Equation (**$$\mathbf{\Phi}$$**)**

We must prevent any separation between the anchor points, and we must prevent the bodies from twisting, pitching, or yawing relative to each other.

1.  **Three Translational Locks (Rows 1-3):** We force the global anchor point of Body i to perfectly overlap the global anchor point of Body j (Spherical Constraint).
2.  **Three Rotational Locks (Rows 4-6):** We force the orthogonal axes of Body i to remain perfectly 90-degrees to the orthogonal axes of Body j (Prismatic Rotational Constraints).

This yields exactly **6 rows**:

$$
\Phi ( q , t ) = \begin{bmatrix}r_{i} + A_{i} \overline{u_{i}} - r_{j} - A_{j} \overline{u_{j}} \\ v_{i} \cdot a_{j} \\ v_{i} \cdot b_{j} \\ a_{i} \cdot b_{j}\end{bmatrix} = \begin{bmatrix}0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0\end{bmatrix}
$$

**2. The Velocity Constraint & Jacobian (**$$\mathbf{\Phi}_{\mathbf{q}}$$**)**

We take the first time derivative ($$\dot{\Phi} = 0$$) to extract the Jacobian blocks for the Augmented Matrix. Because we are combining two joints we have already solved, we just stack their Jacobians.

**Rows 1 to 3 (Translational Locks):**

These are the exact blocks from our Spherical Joint. Let $$s_{i} = A_{i} \overline{u_{i}}$$ and $$s_{j} = A_{j} \overline{u_{j}}$$.

-   Body_i Translational Block: $$I$$ (3x3 Identity Matrix)
-   Body_i Rotational Block: $$- A_{i} \widetilde{s_{i}}$$ (Skew-symmetric matrix of $$s_{i}$$)
-   Body_j Translational Block: $$- I$$
-   Body_j Rotational Block: $$A_{j} \widetilde{s_{j}}$$

**Rows 4 to 6 (Rotational Locks):**

These are the exact Dot-1 blocks from our Prismatic Joint. Pure rotation doesn't translate the CoG, so the Translational Jacobian blocks are exactly zero [0, 0, 0].

For **Row 4** ($$v_{i} \cdot a_{j} = 0$$):

-   Body_i Rotational Block: $$A_{i}^{T} \left( v_{i} \times a_{j} \right)$$
-   Body_j Rotational Block: $$A_{j}^{T} \left( a_{j} \times v_{i} \right)$$

**Row 5** uses $$v_{i} , b_{j}$$ and **Row 6** uses $$a_{i} , b_{j}$$.

**The Fully Assembled** 6 × 12 **Jacobian Block (**$$\mathbf{\Phi}_{\mathbf{q}}$$**):**

$$
\Phi_{q} = \begin{bmatrix}I_{3 \times 3} & - A_{i} \widetilde{s_{i}} & - I_{3 \times 3} & A_{j} \widetilde{s_{j}} \\ \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{i}^{T} \left( v_{i} \times a_{j} \right) & \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{j}^{T} \left( a_{j} \times v_{i} \right) \\ \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{i}^{T} \left( v_{i} \times b_{j} \right) & \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{j}^{T} \left( b_{j} \times v_{i} \right) \\ \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{i}^{T} \left( a_{i} \times b_{j} \right) & \lbrack \begin{matrix}0 & 0 & 0\end{matrix} \rbrack & A_{j}^{T} \left( b_{j} \times a_{i} \right)\end{bmatrix}
$$

## Acceleration Constraint (gamma) for all types of Joints

The Right-Hand Side Acceleration vector ($$\gamma$$ or $$Q_{d}$$) describes how the centripetal and Coriolis forces are derived inside the matrix Solver.

**Mathematical Definitions & Variables**

Following vectors are defined in the **Global** Coordinate System:

-   $$\omega_{i} , \omega_{j}$$: Global angular velocity vectors of Body_i and Body_j.
-   $$s_{i} , s_{j}$$: Global distance vectors from the Body's Center of Gravity to the Joint Anchor.
-   $$v_{i} , a_{i} , b_{i}$$: Global orthogonal triad (Z, X, Y axes) on Body_i.
-   $$v_{j} , a_{j} , b_{j}$$: Global orthogonal triad (Z, X, Y axes) on Body_j.
-   $$d$$: Global distance vector between anchors, where $$d = \left( r_{j} + s_{j} \right) - \left( r_{i} + s_{i} \right)$$.

For sliding Joints (Prismatic, Cylindrical, Planar), we also define the velocity and centripetal derivatives of the distance vector $$d$$:

-   **Distance Velocity:** $$\dot{d} = \left( v e l_{j} + \left( \omega_{j} \times s_{j} \right) \right) - \left( v e l_{i} + \left( \omega_{i} \times s_{i} \right) \right)$$
-   **Distance Centripetal:** $$\ddot{d_{c e n t}} = \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right) - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)$$

In the equations below, subscripts x, y, z denote the scalar Cartesian components of the resulting 3D vector.

**1) Spherical Joint (3 DOFs Removed)**

Restricts translation purely at the anchor points.

-   $$
    \gamma_{1} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{x} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{x}
    $$
-   $$
    \gamma_{2} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{y} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{y}
    $$
-   $$
    \gamma_{3} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{z} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{z}
    $$

**2) Revolute Joint (5 DOFs Removed)**

Combines a Spherical lock (Rows 1-3) with two orthogonal bending locks (Rows 4-5) against the $$v_{i}$$ hinge axis.

-   $$
    \gamma_{1} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{x} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{x}
    $$
-   $$
    \gamma_{2} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{y} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{y}
    $$
-   $$
    \gamma_{3} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{z} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{z}
    $$
-   $$
    \gamma_{4} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot a_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times a_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times a_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{5} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$

**3) Prismatic Joint (5 DOFs Removed)**

Combines full rotational locks (Rows 1-3) with two sliding locks (Rows 4-5) along the $$v_{i}$$ track axis.

-   $$
    \gamma_{1} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot a_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times a_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times a_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{2} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{3} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times a_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times a_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( a_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{4} = - \left\lbrack \left( \ddot{d_{c e n t}} \cdot a_{i} \right) + 2 \left( \dot{d} \cdot \left( \omega_{i} \times a_{i} \right) \right) + \left( d \cdot \left( \omega_{i} \times \left( \omega_{i} \times a_{i} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{5} = - \left\lbrack \left( \ddot{d_{c e n t}} \cdot b_{i} \right) + 2 \left( \dot{d} \cdot \left( \omega_{i} \times b_{i} \right) \right) + \left( d \cdot \left( \omega_{i} \times \left( \omega_{i} \times b_{i} \right) \right) \right) \right\rbrack
    $$

**4) Cylindrical Joint (4 DOFs Removed)**

Allows sliding and spinning along the $$v_{i}$$ shaft.

-   $$
    \gamma_{1} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot a_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times a_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times a_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{2} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{3} = - \left\lbrack \left( \ddot{d_{c e n t}} \cdot a_{i} \right) + 2 \left( \dot{d} \cdot \left( \omega_{i} \times a_{i} \right) \right) + \left( d \cdot \left( \omega_{i} \times \left( \omega_{i} \times a_{i} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{4} = - \left\lbrack \left( \ddot{d_{c e n t}} \cdot b_{i} \right) + 2 \left( \dot{d} \cdot \left( \omega_{i} \times b_{i} \right) \right) + \left( d \cdot \left( \omega_{i} \times \left( \omega_{i} \times b_{i} \right) \right) \right) \right\rbrack
    $$

**5) Planar Joint (3 DOFs Removed)**

Restricts lifting and tilting against the normal vector $$v_{i}$$.

-   $$
    \gamma_{1} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot a_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times a_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times a_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{2} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{3} = - \left\lbrack \left( \ddot{d_{c e n t}} \cdot v_{i} \right) + 2 \left( \dot{d} \cdot \left( \omega_{i} \times v_{i} \right) \right) + \left( d \cdot \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \right) \right\rbrack
    $$

**6) Fixed Joint (6 DOFs Removed)**

Completely welds the two bodies together by combining a Spherical lock and three Rotational locks.

-   $$
    \gamma_{1} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{x} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{x}
    $$
-   $$
    \gamma_{2} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{y} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{y}
    $$
-   $$
    \gamma_{3} = - \left( \omega_{i} \times \left( \omega_{i} \times s_{i} \right) \right)_{z} + \left( \omega_{j} \times \left( \omega_{j} \times s_{j} \right) \right)_{z}
    $$
-   $$
    \gamma_{4} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot a_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times a_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times a_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{5} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times v_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times v_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( v_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$
-   $$
    \gamma_{6} = - \left\lbrack \left( \left( \omega_{i} \times \left( \omega_{i} \times a_{i} \right) \right) \cdot b_{j} \right) + 2 \left( \left( \omega_{i} \times a_{i} \right) \cdot \left( \omega_{j} \times b_{j} \right) \right) + \left( a_{i} \cdot \left( \omega_{j} \times \left( \omega_{j} \times b_{j} \right) \right) \right) \right\rbrack
    $$

**Baumgarte Stabilization (The Drift Corrector)**

The numerical integration causes a tiny rounding errors. As a result, over time, the Joint physically drifts apart. We must apply Baumgarte stabilization to mathematically pull the Joints back together like a spring-damper system.

We replace the standard $$\gamma$$ with a stabilized $$\gamma^{*}$$ in the augmented matrix for all Joints:

$$
\gamma^{*} = \gamma - 2 \alpha \dot{\Phi} - \beta^{2}
$$

Where:

-   $$\Phi$$ is the current position error (calculated in Step 1).
-   $$\dot{\Phi}$$ is the current velocity error (calculated in Step 2).
-   $$\alpha$$ and $$\beta$$ are tuning constants (see “Baumgarte Stabilization” chapter).
