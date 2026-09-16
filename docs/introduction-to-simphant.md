---
title: Introduction to SimPhant
sidebar_label: Introduction
hide_title: true
---

<h1 style={{ textAlign: 'center' }}>SimPhant™</h1>
<h1 style={{ textAlign: 'center' }}>The user Guide</h1>

<div style={{ textAlign: 'center' }}>
  <img src={require('./media/ac0ae53e13223a52af6acb61ab1997a9.png').default} alt="SimPhant" width="250" height="200" style={{ objectFit: 'contain', margin: '1.5rem auto', border: 'none', boxShadow: 'none' }} />
</div>

Welcome to the official documentation for SimPhant, an advanced Multibody Dynamics (MBD) Physics Engine and Simulation environment!

SimPhant is high-precision software for rigorous analytical mechanical modeling, developed to bring your ideas and inventions to life through in-depth analysis of rigid-body systems.

Whether you are modeling a simple pendulum, sizing motors for a multi-axis robotic arm, or calculating the bearing loads inside a planetary gear train, SimPhant evaluates exact physics at every time step without the mathematical sponginess or constraint drift.

The primary purpose of SimPhant is to provide engineers, researchers, and roboticists with exact engineering truth. Unlike iterative real-time gaming physics engines that rely on artificial damping and positional corrections for visual stability, SimPhant prioritizes true kinematic accuracy, thermodynamic energy conservation, and exact extraction of constraint forces using the Lagrange multipliers. Powered by a custom Python-based Differential-Algebraic Equation (DAE) Solver, SimPhant uses an Augmented Formulation and Schur Complement matrix mathematics to perfectly resolve complex mechanical constraints.

SimPhant allows you to virtually assemble mechanical systems, apply real-world dynamic forces, and immediately extract the precise engineering telemetry required to size real-world bearings, tune control loops, and validate mechanical durability.

The software provides the user with a comprehensive suite of mechanical modeling and analysis tools, accessible through an intuitive 3D graphical interface:

**1. Geometry & Rigid Body Modeling**

-   **CAD Import:** Seamlessly import 3D CAD assemblies (STL, OBJ) using topological or material-based mesh splitting.
-   **Parametric Primitives:** Instantly generate mathematically perfect geometric shapes (Boxes, Cylinders, Spheres, Prisms, Cones, Tori, and Links).
-   **Automated Mass Properties:** SimPhant automatically computes the Center of Gravity (CoG), exact mass, volume, and the full principal inertia tensor for every imported or generated body based on user-defined densities.

**2. Kinematic Constraints & Joints**

-   **Standard Joints:** Connect bodies using standard engineering constraints, including Fixed, Spherical, Revolute, Cylindrical, Prismatic, and Planar joints.
-   **Gear Constraints:** Mathematically couple rotary joints to simulate power transmission. Supports Spur, Helical, Internal (Ring), and Bevel gears with automated calculation of separating radial and axial thrust loads.
-   **Reference Frames:** Build localized coordinate systems to safely anchor joints, bodies, and forces at exact angles and offsets.

**3. Actuation & Dynamics**

-   **Forces & Torques:** Apply constant vectors or define complex, time-dependent mathematical functions (e.g., sin(t), step()).
-   **E-Motors & Actuators:** Define intelligent actuators with maximum speed limits, automated torque-curve scaling, and regenerative braking toggles.
-   **Kinematic Motions:** Force joints to follow strict user-defined displacement or velocity profiles, completely overriding external physics.

**4. Compliant Elements & Contacts**

-   **Springs & Bushings:** Model physical compliance using Compression Springs, Torsion Springs, and fully spatial 6-DOF Bushings with custom stiffness, damping, and preloads.
-   **Collision Detection:** Utilize Narrow-Phase mesh-to-mesh contact pairs with regularized friction, customizable penetration exponents, and impact damping.

**5. Simulation Solvers & Telemetry**

-   **Adaptive Integrators:** Choose between high-speed fixed-step solvers (RK4, Symplectic Euler) or industry-standard adaptive algorithms (SciPy RK45, Radau, BDF, LSODA) designed to handle extremely stiff differential equations.
-   **Telemetry Post-Processor:** Instantly graph system energy, rigid body kinematics (displacement, velocity, acceleration), and exact joint reaction forces in a dedicated plotting window.
-   **Data & Media Export:** Export telemetry directly to CSV for external analysis in MATLAB or Excel, or render high-quality WebM animations of your functioning mechanism.

### Getting Started

The fastest way to start with SimPhant is:

1. Download the latest Windows package from [GitHub Releases](https://github.com/valeriy-sh79/SimPhant/releases).
2. Launch `SimPhant.exe`.
3. Open one of the bundled models from the [Examples] folder to explore how real mechanisms are modeled and simulated.

### Product Links

If you want to inspect the implementation, modify the solver, or contribute code, use the Python source edition instead.

- Source repository: [SimPhant](https://github.com/valeriy-sh79/SimPhant)
- Windows releases: [GitHub Releases](https://github.com/valeriy-sh79/SimPhant/releases)
- Documentation website: [SimPhant Docs](https://valeriy-sh79.github.io/simphant-docs/)
- Documentation source: [simphant-docs](https://github.com/valeriy-sh79/simphant-docs)
- Bug reports and feature requests: [Issue tracker](https://github.com/valeriy-sh79/SimPhant/issues)